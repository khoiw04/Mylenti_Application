use crate::donate_events::start_donate_listener;
use crate::local_http_server::start_http_server;
use crate::websocket::start_websocket_server;
use crate::tunnel::create_and_save_tunnel;
use crate::tunnel::ensure_credentials;
use crate::tunnel::setup_tunnel;
use sqlx::SqlitePool;
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::{
    Manager,
    WebviewUrl,
    webview::WebviewWindowBuilder,
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    menu::{Menu, MenuItem},
    RunEvent,
};
use url::Url;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandChild;

mod donate_events;
mod local_http_server;
mod update;
mod websocket;
mod tunnel;

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

fn start_sidecar(name: &str, args: &[&str], app: &tauri::AppHandle) -> Option<CommandChild> {
    let mut command = app.shell().sidecar(name).ok()?;
    for arg in args {
        command = command.arg(arg);
    }

    match command.spawn() {
        Ok((_rx, child)) => {
            log::info!("🚀 Đã khởi động sidecar: {}", name);
            Some(child)
        }
        Err(e) => {
            log::error!("❌ Không thể chạy sidecar {}: {}", name, e);
            None
        }
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

    let donate_voice_process = Arc::new(Mutex::new(None));
    // let node_server_process = Arc::new(Mutex::new(None));

    let donate_voice_process_for_exit = donate_voice_process.clone();
    // let node_server_process_for_exit = node_server_process.clone();

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
        .setup({
            let donate_voice_process = donate_voice_process.clone();
            // let node_server_process = node_server_process.clone();

            move |app| {
                log::info!("🔧 Đang chạy setup Tauri");

                let app_handle = app.app_handle().clone();
                let app_handle_for_window = app_handle.clone();
                let frontend_url_clone = frontend_url.clone();

                let db_path = get_app_db_path();
                let db_url = format!("sqlite://{}", db_path.to_string_lossy().replace('\\', "/"));
                let db_url_for_http = db_url.clone();

                log::info!("🔗 db_url: {}", db_url);

                let quit_item = MenuItem::with_id(app, "quit", "Thoát", true, None::<&str>)?;
                let show_item = MenuItem::with_id(app, "show", "Hiện ứng dụng", true, None::<&str>)?;
                let hide_item = MenuItem::with_id(app, "hide", "Ẩn ứng dụng", true, None::<&str>)?;
                let tray_menu = Menu::with_items(app, &[&show_item, &hide_item, &quit_item])?;

                let donate_voice = start_sidecar("donate_voice", &[], &app_handle);
                *donate_voice_process.lock().unwrap() = donate_voice;

                // start_sidecar("node_server", &[], &app_handle);
                // let node_server = start_sidecar("node_server", &[], &app_handle);
                // *node_server_process.lock().unwrap() = node_server;

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

                TrayIconBuilder::new()
                    .icon(app.default_window_icon().unwrap().clone())
                    .tooltip("Ứng dụng đang chạy")
                    .menu(&tray_menu)
                    .on_menu_event(|app, event| {
                        let window = app.get_webview_window("main").unwrap();
                        match event.id.as_ref() {
                            "show" => {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                            "hide" => {
                                window.hide().unwrap();
                            }
                            "quit" => {
                                app.exit(0);
                            }
                            _ => {}
                        }
                    })
                    .on_tray_icon_event(|tray, event| match event {
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.unminimize();
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {}
                    })
                    .build(app)?;

                Ok(())
            }
        })
        .invoke_handler(tauri::generate_handler![
            create_and_save_tunnel,
            ensure_credentials,
            update::run_update,
            log_frontend,
            setup_tunnel,
            ping
        ])
        .build(tauri::generate_context!())
        .expect("❌ Lỗi khi build ứng dụng Tauri")
        .run(move |_app_handle, event| {
            if let RunEvent::ExitRequested { .. } = event {
                if let Some(child) = donate_voice_process_for_exit.lock().unwrap().take() {
                    let _ = child.kill();
                    log::info!("🛑 Đã dừng donate_voice");
                }
                // if let Some(child) = node_server_process_for_exit.lock().unwrap().take() {
                //     let _ = child.kill();
                //     log::info!("🛑 Đã dừng node_server");
                // }
            }
        });
}