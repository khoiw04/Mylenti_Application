use chrono::Utc;
use futures_util::{SinkExt, StreamExt};
use http::{Request, Response};
use serde_json::Value;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio::sync::Mutex;
use tokio_tungstenite::{accept_hdr_async, tungstenite::Message};

type SharedSender = Arc<
    Mutex<
        futures_util::stream::SplitSink<
            tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>,
            Message,
        >,
    >,
>;

type ClientMap = Arc<Mutex<HashMap<String, SharedSender>>>;

/// Gửi JSON tới tất cả client còn sống
async fn broadcast_json(json: &Value, clients: &ClientMap) {
    let message = Message::Text(json.to_string().into());
    let mut map = clients.lock().await;
    let mut active_clients = HashMap::new();

    for (client_id, sender) in map.iter() {
        let sender = sender.clone();
        let result = {
            let mut locked = sender.lock().await;
            locked.send(message.clone()).await
        };

        if result.is_ok() {
            active_clients.insert(client_id.clone(), sender);
        } else {
            println!("⚠️ Client {} bị ngắt, loại bỏ", client_id);
        }
    }

    *map = active_clients;
}

pub async fn start_websocket_server() -> tokio::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:4455").await?;
    println!("🟢 WebSocket server đang chạy tại ws://127.0.0.1:4455");

    let clients: ClientMap = Arc::new(Mutex::new(HashMap::new()));

    loop {
        let (stream, _) = listener.accept().await?;
        let clients = clients.clone();

        tokio::spawn(async move {
            let client_id_holder = Arc::new(Mutex::new(None::<String>));
            let client_id_holder_clone = client_id_holder.clone();

            let callback = move |req: &Request<()>, response: Response<()>| -> std::result::Result<Response<()>, Response<Option<String>>> {
                if let Some(query) = req.uri().query() {
                    for param in query.split('&') {
                        if let Some((key, value)) = param.split_once('=') {
                            if key == "clientId" {
                                let mut id = client_id_holder_clone.blocking_lock();
                                *id = Some(value.to_string());
                            }
                        }
                    }
                }
                Ok(response)
            };

            match accept_hdr_async(stream, callback).await {
                Ok(ws_stream) => {
                    let (sender, mut receiver) = ws_stream.split();
                    let sender = Arc::new(Mutex::new(sender));

                    let client_id = {
                        let id = client_id_holder.lock().await;
                        id.clone()
                            .unwrap_or_else(|| format!("anonymous-{}", Utc::now().timestamp()))
                    };

                    {
                        let mut map = clients.lock().await;
                        if !map.contains_key(&client_id) {
                            map.insert(client_id.clone(), sender.clone());
                            log::info!("✅ Client mới: {}. Tổng: {}", client_id, map.len());
                        } else {
                            log::info!("🔁 Client {} đã tồn tại, không tăng tổng", client_id);
                        }
                    }

                    while let Some(msg_result) = receiver.next().await {
                        match msg_result {
                            Ok(msg) => match msg {
                                Message::Text(text) => {
                                    let trimmed = text.trim();
                                    if trimmed.is_empty() {
                                        log::info!("⚠️ Nhận chuỗi rỗng, bỏ qua");
                                        continue;
                                    }

                                    match serde_json::from_str::<Value>(trimmed) {
                                        Ok(mut json) => {
                                            json["server_timestamp"] =
                                                Value::String(Utc::now().to_rfc3339());
                                            log::info!(
                                                "📦 JSON hợp lệ:\n{}",
                                                serde_json::to_string_pretty(&json).unwrap()
                                            );
                                            broadcast_json(&json, &clients).await;
                                        }
                                        Err(e) => {
                                            log::error!("❌ JSON không hợp lệ: {}", e);
                                        }
                                    }
                                }
                                Message::Close(frame) => {
                                    log::info!(
                                        "📴 Client {} gửi Close frame: {:?}",
                                        client_id, frame
                                    );
                                    break;
                                }
                                Message::Ping(_) => log::info!("📡 Nhận Ping"),
                                Message::Pong(_) => log::info!("📡 Nhận Pong"),
                                _ => log::error!("⚠️ Nhận tin không xử lý được"),
                            },
                            Err(e) => {
                                log::error!("❌ Lỗi khi nhận tin nhắn: {}", e);
                                break;
                            }
                        }
                    }

                    {
                        let mut map = clients.lock().await;
                        map.remove(&client_id);
                        log::info!(
                            "⚠️ Client {} đã ngắt kết nối. Còn lại: {}",
                            client_id,
                            map.len()
                        );
                    }
                }
                Err(e) => {
                    log::error!("❌ Lỗi khi thiết lập kết nối WebSocket: {}", e);
                }
            }
        });
    }
}
