use crate::donate_events::start_donate_listener;
use crate::local_http_server::start_http_server;
use crate::websocket::start_websocket_server;
use sqlx::SqlitePool;
use std::{env, process::Command, time::Duration};
use tauri::Manager;
use std::path::PathBuf;
use tauri::{webview::WebviewWindowBuilder, WebviewUrl};
use tauri_plugin_http::reqwest::Client;
use tokio::time::sleep;
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

            if !db_path.exists() {
                log::warn!("⚠️ File app.db không tồn tại tại: {}", db_url);
            } else {
                log::info!("📁 File app.db đã tồn tại tại: {}", db_url);
            }
            if let Err(e) = std::fs::OpenOptions::new().write(true).open(&db_path) {
                log::warn!("⚠️ Không thể ghi vào file app.db: {}", e);
            }
            log::info!("🔗 db_url: {}", db_url);
            let flask_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("donate_voice.exe");

            let cloudflared_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("cloudflared.exe");

            // let node_exe_path = env::current_dir()
            //     .unwrap()
            //     .join("bin")
            //     .join("node_server.exe");

            start_process(&flask_exe_path, "donate_voice.exe");
            // start_process(&cloudflared_exe_path, "cloudflared.exe");
            // start_process(&node_exe_path, "node_server.exe");

            tauri::async_runtime::spawn(async move {
                log::info!("🚀 Bắt đầu async block trong setup");

                // if let Err(e) = start_websocket_server().await {
                //     log::error!("❌ WebSocket server lỗi: {}", e);
                // }
                // for i in 1..=20 {
                //     if is_flask_ready().await {
                //         log::info!("✅ Flask server đã sẵn sàng sau {} lần thử", i);
                //         break;
                //     } else {
                //         log::info!("⏳ Đang chờ Flask server... lần {}", i);
                //         sleep(Duration::from_millis(500)).await;
                //     }
                // }
                // for i in 1..=20 {
                //     if node_exe_path().await {
                //         log::info!("✅ Node server đã sẵn sàng sau {} lần thử", i);
                //         break;
                //     } else {
                //         log::info!("⏳ Đang chờ Node server... lần {}", i);
                //         sleep(Duration::from_millis(500)).await;
                //     }
                // }

                log::info!("🔗 Đang kết nối SQLite với db_url: {}", db_url);
                match SqlitePool::connect(&db_url).await {
                    Ok(pool) => {
                        log::info!("✅ Đã kết nối SQLite thành công");

                        // Chạy migration nếu có
                        match sqlx::migrate!().run(&pool).await {
                            Ok(_) => log::info!("📦 Migration đã chạy thành công"),
                            Err(e) => log::error!("❌ Lỗi khi chạy migration: {:?}", e),
                        }

                        // Gọi start_donate_listener
                        log::info!("📡 Gọi start_donate_listener");
                        start_donate_listener(app_handle.clone(), &pool);

                        // Gọi start_http_server
                        log::info!("🌐 Gọi start_http_server");
                        if let Err(e) = async {
                            start_http_server(pool.clone()).await;
                            Ok::<(), sqlx::Error>(())
                        }
                        .await
                        {
                            log::error!("❌ Lỗi khi chạy start_http_server: {:?}", e);
                        } else {
                            log::info!("✅ Đã gọi xong start_http_server");
                        }
                    }
                    Err(e) => {
                        log::error!("❌ Không thể kết nối SQLite: {:?}", e);
                    }
                }

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
