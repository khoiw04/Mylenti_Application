use axum::{
    extract::{Json, Extension},
    response::{IntoResponse, Response},
    routing::post,
    Router,
    http::StatusCode
};
use serde::Deserialize;
use serde_json::json;
use std::{
    net::SocketAddr,
    sync::{Arc, atomic::AtomicBool},
};
use tokio::{net::TcpListener, sync::RwLock};
use std::time::Instant;
use lazy_static::lazy_static;

use crate::gtts::{get_tts, get_random_ipv6, State};

lazy_static! {
    static ref SERVER_START: Instant = Instant::now();
}

#[derive(Deserialize)]
struct TtsRequest {
    text: String,
    voice: String,
}

async fn health_handler() -> impl IntoResponse {
    let uptime = SERVER_START.elapsed().as_secs();

    let status = json!({
        "status": "ok",
        "uptime_seconds": uptime
    });

    (StatusCode::OK, Json(status))
}

#[axum_macros::debug_handler]
async fn tts_handler(
    Extension(state): Extension<Arc<RwLock<State>>>,
    Json(payload): Json<TtsRequest>,
) -> Response {
    let hit_any_deadline = Arc::new(AtomicBool::new(false));

    match get_tts(&state, &payload.text, &payload.voice, hit_any_deadline).await {
        Ok((audio_bytes, content_type)) => {
            let mime = content_type
                .and_then(|ct| ct.to_str().ok().map(|s| s.to_string()))
                .unwrap_or_else(|| "audio/mpeg".to_string());

            (
                [(axum::http::header::CONTENT_TYPE, mime)],
                audio_bytes.to_vec(),
            )
                .into_response()
        }
        Err(err) => (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Lỗi TTS: {}", err),
        )
            .into_response(),
    }
}

pub async fn start_tts_http_server() {
    let state = Arc::new(RwLock::new(
        get_random_ipv6(None).await.expect("Không tạo được state TTS"),
    ));

    let app = Router::new()
        .route("/tts", post(tts_handler))
        .route("/health", axum::routing::get(health_handler))
        .layer(Extension(state));

    let addr = SocketAddr::from(([127, 0, 0, 1], 4545));
    let listener = TcpListener::bind(addr).await.expect("Không thể bind port 4545");

    println!("🚀 TTS HTTP server đang chạy tại http://{}", addr);

    axum::serve(listener, app.into_make_service())
        .await
        .expect("Không thể khởi động Axum server");
}
