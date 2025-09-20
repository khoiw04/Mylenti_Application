use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use lazy_static::lazy_static;
use serde::Serialize;
use sqlx::{Row, SqlitePool};
use std::{
    sync::{Arc, Mutex},
    time::Instant,
    error::Error
};

lazy_static! {
    static ref SERVER_START: Instant = Instant::now();
    static ref CONNECTION_COUNT: Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

#[derive(Serialize)]
struct UserData {
    id: String,
    name: String,
    user_name: String,
    email: String,
    api_key: Option<String>,
    number: Option<String>,
    full_name: Option<String>,
    bank: Option<String>,
    youtube: Option<String>,
    facebook: Option<String>,
    x: Option<String>,
}

#[derive(Serialize)]
struct Donation {
    code: String,
    display_name: String,
    message: String,
    transfer_amount: i64,
    timestamp: Option<String>,
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
                api_key: row.try_get("api_key").ok(),
                number: row.try_get("number").ok(),
                full_name: row.try_get("full_name").ok(),
                bank: row.try_get("bank").ok(),
                youtube: row.try_get("youtube").ok(),
                facebook: row.try_get("facebook").ok(),
                x: row.try_get("x").ok(),
            };

            (StatusCode::OK, Json(data)).into_response()
        }
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "User not found" }))
        ).into_response(),
        Err(e) => {
            log::error!("❌ Lỗi truy vấn user: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Query error" }))
            ).into_response()
        }
    }
}

async fn donations_handler(Path(user_name): Path<String>, State(pool): State<SqlitePool>) -> impl IntoResponse {
    let _ = CONNECTION_COUNT.lock().map(|mut c| *c += 1);

    match sqlx::query(
        "SELECT code, display_name, message, transfer_amount, timestamp \
         FROM donate_events WHERE user_name = ? ORDER BY timestamp DESC"
    )
    .bind(&user_name)
    .fetch_all(&pool)
    .await
    {
        Ok(rows) => {
            let data: Vec<Donation> = rows.into_iter().map(|row| Donation {
                code: row.try_get("code").unwrap_or_default(),
                display_name: row.try_get("display_name").unwrap_or_default(),
                message: row.try_get("message").unwrap_or_default(),
                transfer_amount: row.try_get("transfer_amount").unwrap_or(0),
                timestamp: row.try_get("timestamp").ok(),
            }).collect();

            (StatusCode::OK, Json(data)).into_response()
        }
        Err(e) => {
            log::error!("❌ Lỗi truy vấn donations: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Query error" }))
            ).into_response()
        }
    }
}

pub async fn start_http_server(pool: SqlitePool) -> Result<(), Box<dyn Error>> {
    log::info!("📡 Bắt đầu start_http_server()");

    let listener = match tokio::net::TcpListener::bind("0.0.0.0:8080").await {
        Ok(l) => {
            log::info!("✅ Đã bind tại: {:?}", l.local_addr());
            l
        }
        Err(e) => {
            log::error!("❌ Không thể bind cổng 8080: {}", e);
            return Err(Box::new(e));
        }
    };

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/data/{user_name}", get(user_handler))
        .route("/data/{user_name}/donations", get(donations_handler))
        .with_state(pool.clone());

    log::info!("🚀 HTTP server đang chạy tại http://localhost:8080");

    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}
