use std::sync::{Arc, Mutex};
use std::time::Instant;
use tauri::{AppHandle, Emitter};
use tauri_plugin_updater::UpdaterExt;

#[tauri::command]
pub async fn run_update(app: AppHandle) -> Result<(), String> {
    if let Some(update) = app.updater().map_err(|e| e.to_string())?.check().await.map_err(|e| e.to_string())? {
        let mut downloaded = 0;

        // Clone app để dùng trong closure
        let app_clone = app.clone();

        // Khởi tạo biến thời gian chia sẻ
        let last_time = Arc::new(Mutex::new(Instant::now()));
        let time_clone = last_time.clone();

        update
            .download_and_install(
                move |chunk_length, content_length| {
                    downloaded += chunk_length;

                    let mut last = time_clone.lock().unwrap();
                    let now = Instant::now();
                    let elapsed = now.duration_since(*last).as_secs_f64();
                    *last = now;

                    if elapsed > 0.0 {
                        let speed_mbps = (chunk_length as f64 / 1024.0 / 1024.0) / elapsed;
                        let _ = app_clone.emit("download_speed", speed_mbps);
                    }

                    if let Some(total) = content_length {
                        let progress = (downloaded as f64 / total as f64) * 100.0;
                        let _ = app_clone.emit("update_progress", progress);
                    }
                },
                || {
                    println!("download finished");
                },
            )
            .await
            .map_err(|e| e.to_string())?;

        println!("update installed");
        app.restart();
    }

    Ok(())
}
