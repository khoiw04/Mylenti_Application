use crate::websocket::start_websocket_server;
use tauri::{webview::WebviewWindowBuilder, WebviewUrl};
use std::{env, process::Command, time::Duration};
use tauri_plugin_http::reqwest::Client;
use tokio::time::sleep;
use tauri::Manager;
use url::Url;

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
    match Client::new()
        .get("http://127.0.0.1:3000")
        .send()
        .await
    {
        Ok(res) => res.status().is_success(),
        Err(_) => false,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port: u16 = 3000;
    let frontend_url: Url = format!("http://localhost:{}", port).parse().unwrap();

    tauri::Builder::default()
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
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            let app_handle = app.app_handle();
            let app_handle_for_window = app_handle.clone();
            let frontend_url_clone = frontend_url.clone();

            let flask_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("donate_voice.exe");

            let node_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("node_server.exe");

            if !flask_exe_path.exists() {
                log::error!(
                    "❌ File donate_voice.exe không tồn tại tại: {}",
                    flask_exe_path.display()
                );
                return Ok(());
            }

            if !node_exe_path.exists() {
                log::error!(
                    "❌ File node_server.exe không tồn tại tại: {}",
                    node_exe_path.display()
                );
                return Ok(());
            }

            Command::new(flask_exe_path)
                .spawn()
                .expect("❌ Không thể chạy donate_voice.exe");

            Command::new(node_exe_path)
                .spawn()
                .expect("❌ Không thể chạy node_server.exe");

            tauri::async_runtime::spawn(async move {
                if let Err(e) = start_websocket_server().await {
                    log::error!("❌ WebSocket server lỗi: {}", e);
                }

                for i in 1..=20 {
                    if is_flask_ready().await {
                        log::info!("✅ Flask server đã sẵn sàng sau {} lần thử", i);
                        break;
                    } else {
                        log::info!("⏳ Đang chờ Flask server... lần {}", i);
                        sleep(Duration::from_millis(500)).await;
                    }
                }

                for i in 1..=20 {
                    if is_node_ready().await {
                        log::info!("✅ Node server đã sẵn sàng sau {} lần thử", i);

                        if let Err(e) = WebviewWindowBuilder::new(
                            &app_handle_for_window,
                            "main".to_string(),
                            WebviewUrl::External(frontend_url_clone),
                        )
                        .title("Localhost Mylenti")
                        .build()
                        {
                            log::error!("❌ Lỗi tạo WebviewWindow: {}", e);
                        }

                        break;
                    } else {
                        log::info!("⏳ Đang chờ Node server... lần {}", i);
                        sleep(Duration::from_millis(500)).await;
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update::run_update])
        .run(tauri::generate_context!())
        .expect("❌ Lỗi khi chạy ứng dụng Tauri");
}