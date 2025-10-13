use axum::{
    extract::{Path, Query, State},
    http::{Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, options, post},
    Json, Router,
};
use axum_macros::debug_handler;
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

#[derive(Debug, Deserialize)]
#[allow(non_snake_case)]
pub struct SePayWebhook {
    id: i64,
    gateway: String,
    transactionDate: String,
    accountNumber: String,
    code: Option<String>,
    content: String,
    transferType: String,
    transferAmount: i64,
    accumulated: i64,
    subAccount: Option<String>,
    referenceCode: String,
    description: String,
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

#[debug_handler]
pub async fn webhook_sepay_handler(
    Path(user_name): Path<String>,
    State(pool): State<SqlitePool>,
    headers: axum::http::HeaderMap,
    Json(payload): Json<SePayWebhook>,
) -> impl IntoResponse {
    let auth_header = headers.get("authorization").and_then(|v| v.to_str().ok());
    let source = headers.get("user-agent").and_then(|v| v.to_str().ok()).unwrap_or("unknown");

    if auth_header.is_none() {
        log::warn!("❌ Thiếu Authorization header từ {}", source);
        return (StatusCode::UNAUTHORIZED, "Thiếu header Authorization").into_response();
    }

    let auth = auth_header.unwrap();

    let user_row = match sqlx::query("SELECT api_key FROM users WHERE user_name = ?")
        .bind(&user_name)
        .fetch_optional(&pool)
        .await
    {
        Ok(row) => row,
        Err(e) => {
            log::error!("❌ DB error: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "DB error",
            )
                .into_response();
        }
    };

    let api_key = match user_row {
        Some(row) => row.try_get::<String, _>("api_key").unwrap_or_default(),
        None => {
            log::warn!("❌ Không tìm thấy user_name: {}", user_name);
            return (StatusCode::UNAUTHORIZED, "User not found").into_response();
        }
    };

    if format!("Apikey {}", api_key) != auth {
        log::warn!("❌ Sai API Key cho user_name: {}", user_name);
        return (StatusCode::UNAUTHORIZED, "Unauthorized").into_response();
    }

    let code = match &payload.code {
        Some(c) if !c.trim().is_empty() => c.trim(),
        _ => {
            log::warn!("❌ Payload không có code hợp lệ");
            return (StatusCode::BAD_REQUEST, "Missing or empty code").into_response();
        }
    };

    let result = sqlx::query(
        "INSERT INTO donate_events (
            code, user_name, id_transaction, gateway, transaction_date, account_number, content,
            transfer_type, transfer_amount, accumulated, sub_account, reference_code,
            description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(code) DO UPDATE SET
            id_transaction = excluded.id_transaction,
            gateway = excluded.gateway,
            transaction_date = excluded.transaction_date,
            account_number = excluded.account_number,
            content = excluded.content,
            transfer_type = excluded.transfer_type,
            transfer_amount = excluded.transfer_amount,
            accumulated = excluded.accumulated,
            sub_account = excluded.sub_account,
            reference_code = excluded.reference_code,
            description = excluded.description,
            status = excluded.status"
    )
    .bind(code)
    .bind(&user_name)
    .bind(payload.id)
    .bind(&payload.gateway)
    .bind(&payload.transactionDate)
    .bind(&payload.accountNumber)
    .bind(&payload.content)
    .bind(&payload.transferType)
    .bind(payload.transferAmount)
    .bind(payload.accumulated)
    .bind(&payload.subAccount)
    .bind(&payload.referenceCode)
    .bind(&payload.description)
    .bind("received")
    .execute(&pool)
    .await;

    if let Err(e) = result {
        log::error!("❌ Lỗi khi upsert từ webhook SePay: {:?}", e);
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("DB error: {}", e),
        )
        .into_response();
    }

    log::info!("✅ Webhook SePay xử lý thành công");
    (StatusCode::OK, "Webhook received").into_response()
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
        .route("/webhook/sepay", post(webhook_sepay_handler))
        .layer(cors)
        .with_state(pool.clone());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    log::info!("🚀 HTTP server đang chạy tại http://localhost:8080");

    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}