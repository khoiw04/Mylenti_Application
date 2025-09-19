use crate::websocket::start_websocket_server;
use std::env;
use url::Url;
use std::process::Command;
use std::time::Duration;
use tauri::{webview::WebviewWindowBuilder, WebviewUrl};
use tauri_plugin_http::reqwest::Client;
use tokio::time::sleep;
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port: u16 = 5173;
    let url = Url::parse(&format!("http://localhost:{}", port)).unwrap();
    let flask_exe_path = env::current_dir()
        .unwrap()
        .join("bin")
        .join("donate_voice.exe");
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
        .setup(|app| {
            let app_handle = app.handle().clone();
            if !flask_exe_path.exists() {
                log::error!(
                    "❌ File donate_voice.exe không tồn tại tại: {}",
                    flask_exe_path.display()
                );
                return Ok(());
            };

            Command::new(flask_exe_path)
                .spawn()
                .expect("❌ Không thể chạy donate_voice.exe");

            // Command::new("node")
            //     .arg("../../../.output/server/index.mjs")
            //     .spawn()
            //     .expect("Failed to start Node server");

            tauri::async_runtime::spawn(async move {
                if let Err(e) = start_websocket_server().await {
                    log::error!("❌ WebSocket server lỗi: {}", e);
                }

                for attempt in 1..=20 {
                    if is_flask_ready().await {
                        log::info!("✅ Flask server đã sẵn sàng sau {} lần thử", attempt);

                        match WebviewWindowBuilder::new(&app_handle, "main", WebviewUrl::External(url.clone()))
                            .title("Localhost")
                            .build()
                        {
                            Ok(_) => log::info!("✅ WebviewWindow đã được tạo thành công"),
                            Err(e) => log::error!("❌ Lỗi tạo WebviewWindow: {}", e),
                        }

                        break;
                    } else {
                        log::info!("⏳ Đang chờ Flask server... lần {}", attempt);
                        sleep(Duration::from_millis(500)).await;
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update::run_update])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
