use crate::websocket::start_websocket_server;
use std::time::Duration;
use tauri_plugin_http::reqwest::Client;
use tauri_plugin_log::Target;
use std::process::Command;
use tokio::time::sleep;
use std::env;
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
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new()
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
            .build()
        )
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
        
        .setup(|app| {
            let flask_exe_path = env::current_dir()
                .unwrap()
                .join("bin")
                .join("donate_voice.exe");

            if !flask_exe_path.exists() {
                log::error!("❌ File donate_voice.exe không tồn tại tại: {}", flask_exe_path.display());
                return Ok(());
            };

            Command::new(flask_exe_path)
                .spawn()
                .expect("❌ Không thể chạy donate_voice.exe");

            tauri::async_runtime::spawn(async {
                if let Err(e) = start_websocket_server().await {
                    log::error!("❌ WebSocket server lỗi: {}", e);
                }

                for i in 1..=10 {
                    if is_flask_ready().await {
                        log::info!("✅ Flask server đã sẵn sàng sau {} lần thử", i);
                        break;
                    } else {
                        log::error!("⏳ Đang chờ Flask server... lần {}", i);
                        sleep(Duration::from_millis(500)).await;
                    }
                }
            });

            // let flask_cmd = format!(
            //     "{} & pause",
            //     flask_exe_path.to_string_lossy().replace('!', "^!")
            // );

            // let _child = app
            //     .shell()
            //     .command("cmd")
            //     .args(&["/C", "start", "cmd", "/K", &flask_cmd])
            //     .spawn()
            //     .expect("❌ Không thể mở CMD để chạy Flask");

            // if cfg!(debug_assertions) {
            //     app.handle().plugin(
            //         tauri_plugin_log::Builder::default()
            //             .level(log::LevelFilter::Info)
            //             .build(),
            //     )?;
            // };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update::run_update])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
