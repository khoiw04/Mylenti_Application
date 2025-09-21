use sqlx::{Row, SqlitePool};
use tauri::{AppHandle, Emitter};
use tokio::time::{sleep, Duration};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[serde(rename_all = "lowercase")]
enum TransferType {
    In,
    Out,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[serde(rename_all = "lowercase")]
enum DonationStatus {
    Error,
    Pending,
    Received,
}

#[derive(Serialize, Clone)]
struct DonatePreviewPayload {
    code: String,
    user_name: String,
    display_name: String,
    message: String,
    transfer_amount: i64,
}

pub fn start_donate_listener(app: AppHandle, pool: &SqlitePool) {
    let pool = pool.clone();
    let app = app.clone();

    tokio::spawn(async move {
        match 
        sqlx::query(
            "
                CREATE TABLE IF NOT EXISTS donate_events (
                code TEXT PRIMARY KEY,
                email TEXT DEFAULT NULL,
                display_name TEXT,
                display_avatar TEXT,
                user_name TEXT,
                message TEXT,
                receiver TEXT,

                id_transaction INTEGER,
                gateway TEXT,
                transaction_date TEXT,
                account_number TEXT,
                content TEXT,
                transfer_type TEXT CHECK (transfer_type IN ('in', 'out')),
                transfer_amount INTEGER,
                accumulated INTEGER,
                sub_account TEXT,
                reference_code TEXT,
                description TEXT,
                notified BOOLEAN DEFAULT 0,
                status TEXT CHECK (status IN ('error', 'pending', 'received')),

                created_at TEXT
            )"
        )
        .execute(&pool)
        .await
        {
            Ok(_) => log::info!("✅ Bảng donate_events đã sẵn sàng"),
            Err(e) => log::error!("❌ Không thể tạo bảng donate_events: {:?}", e),
        };
        loop {
            match sqlx::query(
                "SELECT code, user_name, display_name, message, transfer_amount \
                 FROM donate_events WHERE status = 'received' AND notified = 0",
            )
            .fetch_all(&pool)
            .await
            {
                Ok(rows) => {
                    for row in rows {
                        if let Err(e) = handle_donation(row, &app, &pool).await {
                            log::error!("❌ Lỗi khi xử lý donate: {:?}", e);
                        }
                    }
                }
                Err(e) => {
                    log::error!("❌ Lỗi khi truy vấn donate_events: {:?}", e);
                }
            }

            sleep(Duration::from_secs(2)).await;
        };
    });
}

async fn handle_donation(
    row: sqlx::sqlite::SqliteRow,
    app: &AppHandle,
    pool: &SqlitePool,
) -> Result<(), sqlx::Error> {
    let code = row.try_get::<String, _>("code").unwrap_or_default();
    let user_name = row.try_get::<String, _>("user_name").unwrap_or_default();
    let display_name = row.try_get::<String, _>("display_name").unwrap_or_default();
    let message = row.try_get::<String, _>("message").unwrap_or_default();
    let transfer_amount = row.try_get::<i64, _>("transfer_amount").unwrap_or(0);

    let payload = DonatePreviewPayload {
        code: code.clone(),
        user_name,
        display_name,
        message,
        transfer_amount,
    };

    if let Err(e) = app.emit("donate_received", payload) {
        log::error!("❌ Lỗi khi emit donate_received: {:?}", e);
    }

    sqlx::query("UPDATE donate_events SET notified = 1 WHERE code = ?")
        .bind(code)
        .execute(pool)
        .await?;

    Ok(())
}