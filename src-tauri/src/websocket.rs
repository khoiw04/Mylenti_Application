use tokio::net::TcpListener;
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures_util::{StreamExt, SinkExt};
use tokio::sync::Mutex;
use std::sync::Arc;
use tokio::io::Result;
use serde_json::Value;
use chrono::Utc;

type SharedSender = Arc<Mutex<futures_util::stream::SplitSink<
    tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>,
    Message,
>>>;

type ClientList = Arc<Mutex<Vec<SharedSender>>>;

async fn broadcast_json(json: &Value, clients: &ClientList) {
    let message = Message::Text(json.to_string().into());
    let mut list = clients.lock().await;
    let mut active_clients = Vec::new();

    for client in list.iter() {
        let client = client.clone();
        let result = {
            let mut locked = client.lock().await;
            locked.send(message.clone()).await
        };

        if result.is_ok() {
            active_clients.push(client);
        } else {
            println!("⚠️ Client bị ngắt, loại bỏ");
        }
    }

    *list = active_clients;
}

pub async fn start_websocket_server() -> Result<()> {
    let listener = TcpListener::bind("127.0.0.1:4455").await?;
    println!("🟢 WebSocket server đang chạy tại ws://127.0.0.1:4455");

    let clients: ClientList = Arc::new(Mutex::new(Vec::new()));

    loop {
        let (stream, _) = listener.accept().await?;
        let clients = clients.clone();

        tokio::spawn(async move {
            match accept_async(stream).await {
                Ok(ws_stream) => {
                    let (sender, mut receiver) = ws_stream.split();
                    let sender = Arc::new(Mutex::new(sender));

                    {
                        let mut list = clients.lock().await;
                        list.push(sender.clone());
                        println!("✅ Client mới kết nối. Tổng: {}", list.len());
                    }

                    while let Some(msg_result) = receiver.next().await {
                        match msg_result {
                            Ok(msg) => {
                                if let Ok(text) = msg.to_text() {
                                    if text.trim().is_empty() {
                                        println!("⚠️ Nhận chuỗi rỗng, bỏ qua");
                                        continue;
                                    }

                                    match serde_json::from_str::<Value>(text) {
                                        Ok(mut json) => {
                                            println!("📦 JSON: {:?}", json);
                                            json["server_timestamp"] = Value::String(Utc::now().to_rfc3339());
                                            broadcast_json(&json, &clients).await;
                                        }
                                        Err(e) => {
                                            println!("❌ JSON không hợp lệ: {}", e);
                                        }
                                    }
                                }
                            }
                            Err(e) => {
                                println!("❌ Lỗi khi nhận tin nhắn: {}", e);
                                break;
                            }
                        }
                    }

                    {
                        let mut list = clients.lock().await;
                        list.retain(|c| !Arc::ptr_eq(c, &sender));
                        println!("⚠️ Client đã ngắt kết nối. Còn lại: {}", list.len());
                    }
                }
                Err(e) => {
                    eprintln!("❌ Lỗi khi thiết lập kết nối WebSocket: {}", e);
                }
            }
        });
    }
}
