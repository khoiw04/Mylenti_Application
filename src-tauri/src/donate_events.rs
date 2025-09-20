use serde::Serialize;
use sqlx::{Row, SqlitePool};
use tauri::{AppHandle, Emitter};
use tokio::time::{sleep, Duration};

#[derive(Serialize, Clone)]
struct DonatePayload {
    code: String,
    user_name: String,
    display_name: String,
    message: String,
    transfer_amount: i64,
}

pub fn start_donate_listener(app: AppHandle, pool: &SqlitePool) {
    let pool = pool.clone();
    tokio::spawn(async move {
        loop {
            let pending_donations = sqlx::query(
                "SELECT code, user_name, display_name, message, transfer_amount \
                 FROM donate_events WHERE status = 'received' AND notified = 0",
            )
            .fetch_all(&pool)
            .await
            .unwrap_or_default();

            for row in pending_donations {
                let code = row.try_get::<String, _>("code").unwrap_or_default();
                let user_name = row.try_get::<String, _>("user_name").unwrap_or_default();
                let display_name = row.try_get::<String, _>("display_name").unwrap_or_default();
                let message = row.try_get::<String, _>("message").unwrap_or_default();
                let transfer_amount = row.try_get::<i64, _>("transfer_amount").unwrap_or(0);

                let payload = DonatePayload {
                    code: code.clone(),
                    user_name: user_name.clone(),
                    display_name,
                    message,
                    transfer_amount,
                };

                let _ = app.emit("donate_received", payload);
                let _ = sqlx::query("UPDATE donate_events SET notified = 1 WHERE code = ?")
                    .bind(code)
                    .execute(&pool)
                    .await;
            }

            sleep(Duration::from_secs(2)).await;
        }
    });
}
