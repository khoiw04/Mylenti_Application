use tokio::net::TcpListener;
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures_util::{StreamExt, SinkExt};
use tokio::sync::Mutex;
use std::sync::Arc;
use tokio::io::Result;
use serde_json::Value;

type SharedSender = Arc<Mutex<futures_util::stream::SplitSink<tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>, Message>>>;
type ClientList = Arc<Mutex<Vec<SharedSender>>>;

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

          // Lưu client vào danh sách
          clients.lock().await.push(sender.clone());

          while let Some(Ok(msg)) = receiver.next().await {
            if let Ok(text) = msg.to_text() {
              println!("📨 Nhận: {}", text);

              // Parse JSON (không phân loại)
              if let Ok(json) = serde_json::from_str::<Value>(text) {
                println!("📦 JSON: {:?}", json);
              }

              // Broadcast tới tất cả client
              let mut list = clients.lock().await;
              let mut new_clients = Vec::new();

              for client in list.iter() {
                let mut locked = client.lock().await;
                if locked.send(Message::Text(text.to_string().into())).await.is_ok() {
                  new_clients.push(client.clone());
                } else {
                  println!("⚠️ Client bị ngắt, loại bỏ");
                }
              }

              *list = new_clients;
            }
          }
        }
        Err(e) => {
          eprintln!("❌ Lỗi kết nối WebSocket: {}", e);
        }
      }
    });
  }
}
