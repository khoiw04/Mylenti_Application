use sqlx::{Row, SqlitePool};
use tauri::Emitter;
use tauri::AppHandle;
use tokio::{time::{sleep, Duration}, task};
use serde::{Deserialize, Serialize};
use futures::stream::{FuturesUnordered, StreamExt};

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

    task::spawn(async move {
        if let Err(e) = init_donation_table(&pool).await {
            log::error!("❌ Không thể tạo bảng donate_events: {:?}", e);
            return;
        }

        log::info!("✅ Bảng donate_events đã sẵn sàng");

        loop {
            if let Err(e) = process_pending_donations(&app, &pool).await {
                log::error!("❌ Lỗi khi xử lý donate_events: {:?}", e);
            }

            sleep(Duration::from_secs(2)).await;
        }
    });
}

async fn init_donation_table(pool: &SqlitePool) -> Result<(), sqlx::Error> {
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
    .execute(pool)
    .await?;

    Ok(())
}

async fn process_pending_donations(app: &AppHandle, pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let rows = sqlx::query(
        "SELECT code, user_name, display_name, message, transfer_amount \
         FROM donate_events WHERE status = 'received' AND notified = 0"
    )
    .fetch_all(pool)
    .await?;

    let mut tasks = FuturesUnordered::new();

    for row in rows {
        tasks.push(handle_donation(row, app, pool));
    }

    while let Some(result) = tasks.next().await {
        if let Err(e) = result {
            log::error!("❌ Lỗi khi xử lý donate: {:?}", e);
        }
    }

    Ok(())
}

async fn handle_donation(
    row: sqlx::sqlite::SqliteRow,
    app: &AppHandle,
    pool: &SqlitePool,
) -> Result<(), sqlx::Error> {
    let payload = DonatePreviewPayload {
        code: row.try_get("code").unwrap_or_default(),
        user_name: row.try_get("user_name").unwrap_or_default(),
        display_name: row.try_get("display_name").unwrap_or_default(),
        message: row.try_get("message").unwrap_or_default(),
        transfer_amount: row.try_get("transfer_amount").unwrap_or(0),
    };

    if let Err(e) = app.emit("donate_received", payload.clone()) {
        log::error!("❌ Lỗi khi emit donate_received: {:?}", e);
    }

    sqlx::query("UPDATE donate_events SET notified = 1 WHERE code = ?")
        .bind(&payload.code)
        .execute(pool)
        .await?;

    Ok(())
}