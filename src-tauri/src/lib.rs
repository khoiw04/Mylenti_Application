use crate::donate_events::start_donate_listener;
use crate::local_http_server::start_http_server;
use crate::websocket::start_websocket_server;
use sqlx::SqlitePool;
use std::sync::Arc;
use std::{env, process::Command};
use tauri::Manager;
use std::path::PathBuf;
use tauri::{webview::WebviewWindowBuilder, WebviewUrl};
use tauri_plugin_http::reqwest::Client;
use tauri::AppHandle;
use url::Url;

mod donate_events;
mod local_http_server;
mod update;
mod websocket;

async fn is_flask_ready() -> bool {
    match Client::new()
        .get("http://127.0.0.1:6000/health")
        .send()
        .await
    {
        Ok(res) => res.status().is_success(),
        Err(_) => false,
    }
}

async fn is_node_ready() -> bool {
    match Client::new().get("http://127.0.0.1:3000").send().await {
        Ok(res) => res.status().is_success(),
        Err(_) => false,
    }
}

#[tauri::command]
fn ping() -> String {
    "pong".into()
}

#[tauri::command]
fn log_frontend(
    level: String,
    message: String,
    source: Option<String>,
    lineno: Option<u32>,
    colno: Option<u32>,
) {
    let prefix = match level.as_str() {
        "error" => "🚨 ERROR",
        "warn" => "⚠️ WARN",
        "info" => "ℹ️ INFO",
        _ => "🔍 LOG",
    };

    println!(
        "{}: {}\nSource: {:?}\nLine: {:?}, Column: {:?}",
        prefix, message, source, lineno, colno
    );
}

fn start_process(path: &std::path::Path, name: &str) {
    if !path.exists() {
        log::error!("❌ File {} không tồn tại tại: {}", name, path.display());
        return;
    }

    match Command::new(path).spawn() {
        Ok(_) => log::info!("🚀 Đã khởi động {}", name),
        Err(e) => log::error!("❌ Không thể chạy {}: {}", name, e),
    }
}

fn get_app_db_path() -> PathBuf {
    let mut path = dirs::data_dir().unwrap_or_else(|| std::env::current_dir().unwrap());
    path.push("com.khoiw04.mylenti");
    path.push("app.db");
    path
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port: u16 = 3000;
    let frontend_url: Url = format!("http://localhost:{}", port).parse().unwrap();

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .max_file_size(50_000)
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "[{} {}] {}",
                        record.level(),
                        record.target(),
                        message
                    ))
                })
                .build(),
        )
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        // .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            log::info!("🔧 Đang chạy setup Tauri");

            let app_handle = app.app_handle().clone();
            let app_handle_for_window = app_handle.clone();
            let frontend_url_clone = frontend_url.clone();

            let db_path = get_app_db_path();
            let db_url = format!("sqlite://{}", db_path.to_string_lossy().replace('\\', "/"));
            let db_url_for_http = db_url.clone();

            log::info!("🔗 db_url: {}", db_url);

            let flask_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("donate_voice.exe");

            let cloudflared_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("cloudflared.exe");

            let node_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("node_server.exe");

            start_process(&flask_exe_path, "donate_voice.exe");
            // start_process(&cloudflared_exe_path, "cloudflared.exe");
            // start_process(&node_exe_path, "node_server.exe");

            tauri::async_runtime::spawn(async move {
                let pool = match SqlitePool::connect(&db_url_for_http).await {
                    Ok(p) => p,
                    Err(e) => {
                        log::error!("❌ Không thể kết nối SQLite cho HTTP server: {:?}", e);
                        return;
                    }
                };

                if let Err(e) = start_http_server(pool).await {
                    log::error!("❌ Lỗi khi chạy HTTP server: {:?}", e);
                }
            });
            tauri::async_runtime::spawn(async move {
                log::info!("🚀 Bắt đầu async block trong setup");

                let pool = Arc::new(
                    SqlitePool::connect(&db_url)
                        .await
                        .unwrap_or_else(|e| {
                            log::error!("❌ Không thể kết nối SQLite: {:?}", e);
                            panic!("Dừng ứng dụng vì không thể kết nối DB");
                        }),
                );

                tokio::spawn({
                    let donate_pool = Arc::clone(&pool);
                    let app_handle = app_handle.clone();
                    async move {
                        log::info!("📡 Bắt đầu start_donate_listener");
                        start_donate_listener(app_handle, &(*donate_pool).clone());
                    }
                });

                tokio::spawn(async {
                    match start_websocket_server().await {
                        Ok(_) => log::info!("🔌 WebSocket server đã khởi động thành công"),
                        Err(e) => log::error!("❌ WebSocket server lỗi: {}", e),
                    }
                });

                log::info!("🪟 Đang tạo WebviewWindow");
                match WebviewWindowBuilder::new(
                    &app_handle_for_window,
                    "main".to_string(),
                    WebviewUrl::External(frontend_url_clone),
                )
                .title("Localhost Mylenti")
                .build()
                {
                    Ok(_) => log::info!("🪟 Đã tạo WebviewWindow thành công"),
                    Err(e) => log::error!("❌ Lỗi tạo WebviewWindow: {}", e),
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            update::run_update,
            log_frontend,
            ping
        ])
        .run(tauri::generate_context!())
        .expect("❌ Lỗi khi chạy ứng dụng Tauri");
}