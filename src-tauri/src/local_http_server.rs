use axum::{
    extract::{Path, Query, State},
    http::{Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, options, post},
    Json, Router,
};
use axum_macros::debug_handler;
use http::HeaderValue;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use sqlx::{Row, SqlitePool};
use std::{
    collections::HashMap, error::Error, sync::{Arc, Mutex}, time::Instant
};
use tower_http::cors::{Any, CorsLayer};

lazy_static! {
    static ref SERVER_START: Instant = Instant::now();
    static ref CONNECTION_COUNT: Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

#[derive(Serialize, Clone)]
struct UserData {
    id: String,
    name: String,
    user_name: String,
    email: String,
    number: Option<String>,
    full_name: Option<String>,
    bank: Option<String>,
    youtube: Option<String>,
    facebook: Option<String>,
    x: Option<String>,
    avatar: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct DonationPreview {
    code: String,
    email: String,
    display_name: String,
    display_avatar: String,
    user_name: String,
    receiver: String,
    message: String,
    transfer_amount: i64,
    created_at: String,
    status: String,
}

async fn health_handler(State(pool): State<SqlitePool>) -> impl IntoResponse {
    let uptime = SERVER_START.elapsed().as_secs();
    let count = CONNECTION_COUNT.lock().map(|c| *c).unwrap_or(0);

    let db_status = match sqlx::query("SELECT 1").fetch_one(&pool).await {
        Ok(_) => "connected",
        Err(_) => "error",
    };

    let json = serde_json::json!({
        "status": "ok",
        "uptime_seconds": uptime,
        "connections": count,
        "database": db_status
    });

    (StatusCode::OK, Json(json))
}

async fn user_handler(Path(user_name): Path<String>, State(pool): State<SqlitePool>) -> impl IntoResponse {
    let _ = CONNECTION_COUNT.lock().map(|mut c| *c += 1);

    match sqlx::query("SELECT * FROM users WHERE user_name = ?")
        .bind(&user_name)
        .fetch_optional(&pool)
        .await
    {
        Ok(Some(row)) => {
            let data = UserData {
                id: row.try_get("id").unwrap_or_default(),
                name: row.try_get("name").unwrap_or_default(),
                user_name: row.try_get("user_name").unwrap_or_default(),
                email: row.try_get("email").unwrap_or_default(),
                number: row.try_get("number").ok(),
                full_name: row.try_get("full_name").ok(),
                bank: row.try_get("bank").ok(),
                youtube: row.try_get("youtube").ok(),
                facebook: row.try_get("facebook").ok(),
                x: row.try_get("x").ok(),
                avatar: row.try_get("avatar").ok(),
            };

            (StatusCode::OK, Json(data)).into_response()
        }
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "User not found" })),
        )
            .into_response(),
        Err(e) => {
            log::error!("❌ Lỗi truy vấn user: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Query error" })),
            )
                .into_response()
        }
    }
}

async fn donations_handler(
    Path(user_name): Path<String>,
    Query(params): Query<HashMap<String, String>>,
    State(pool): State<SqlitePool>,
) -> impl IntoResponse {
    let _ = CONNECTION_COUNT.lock().map(|mut c| *c += 1);

    let status_filter = params.get("status").map(|s| s.as_str());

    let base_query = "SELECT code, email, display_name, display_avatar, user_name, receiver, message, transfer_amount, created_at, status \
                      FROM donate_events WHERE user_name = ?";
    let full_query = if let Some(_) = status_filter {
        format!("{base_query} AND status = ? ORDER BY created_at DESC")
    } else {
        format!("{base_query} ORDER BY created_at DESC")
    };

    let mut query = sqlx::query(&full_query).bind(&user_name);
    if let Some(status) = status_filter {
        query = query.bind(status);
    }

    match query.fetch_all(&pool).await {
        Ok(rows) => {
            let data: Vec<DonationPreview> = rows
                .into_iter()
                .map(|row| DonationPreview {
                    code: row.try_get("code").unwrap_or_default(),
                    email: row.try_get("email").unwrap_or_default(),
                    display_name: row.try_get("display_name").unwrap_or_default(),
                    display_avatar: row.try_get("display_avatar").unwrap_or_default(),
                    user_name: row.try_get("user_name").unwrap_or_default(),
                    receiver: row.try_get("receiver").unwrap_or_default(),
                    message: row.try_get("message").unwrap_or_default(),
                    transfer_amount: row.try_get("transfer_amount").unwrap_or(0),
                    created_at: row.try_get("created_at").unwrap_or_default(),
                    status: row.try_get("status").unwrap_or_default(),
                })
                .collect();

            (StatusCode::OK, Json(data)).into_response()
        }
        Err(e) => {
            log::error!("❌ Lỗi truy vấn donations: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": format!("Query error: {}", e) }))
            ).into_response()
        }
    }
}

#[debug_handler]
async fn post_donation_handler(
    Path(user_name): Path<String>,
    State(pool): State<SqlitePool>,
    Json(payload): Json<DonationPreview>,
) -> Response {
    let _ = CONNECTION_COUNT.lock().map(|mut c| *c += 1);

    let result = sqlx::query(
        "INSERT INTO donate_events (
            code, email, display_name, display_avatar, user_name, receiver, message, transfer_amount, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&payload.code)
    .bind(&payload.email)
    .bind(&payload.display_name)
    .bind(&payload.display_avatar)
    .bind(&user_name)
    .bind(&payload.receiver)
    .bind(&payload.message)
    .bind(payload.transfer_amount)
    .bind(&payload.created_at)
    .bind("pending")
    .execute(&pool)
    .await;

    match result {
        Ok(res) => {
            log::info!("✅ Insert thành công: {} dòng ảnh hưởng", res.rows_affected());
            (StatusCode::CREATED, Json(serde_json::json!({ "status": "success" }))).into_response()
        }
        Err(e) => {
            log::error!("❌ Lỗi khi insert donation: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": format!("Insert failed: {}", e) })),
            )
                .into_response()
        }
    }
}

pub async fn start_http_server(pool: SqlitePool) -> Result<(), Box<dyn Error>> {
    log::info!("📡 Bắt đầu start_http_server()");
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([http::header::CONTENT_TYPE])
        .allow_origin(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/data/{user_name}", get(user_handler))
        .route("/data/{user_name}/donations", get(donations_handler))
        .route("/data/{user_name}/donations", post(post_donation_handler))
        .route("/data/{user_name}/donations", options(|| async { StatusCode::OK }))
        .layer(cors)
        .with_state(pool.clone());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    log::info!("🚀 HTTP server đang chạy tại http://localhost:8080");

    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}
