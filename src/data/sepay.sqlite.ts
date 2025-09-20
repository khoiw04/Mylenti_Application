import type { WebhookLogEntry, WebhookSepaySchemaType } from "@/types"
import { getDB } from "@/data/discord.sqlite"

export async function initSepayDonateTable() {
  const db = await getDB()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS donate_events (
      code TEXT PRIMARY KEY,
      email TEXT,
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

      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function initWebhookLogTable() {
  const db = await getDB()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT,                  -- IP hoặc tên dịch vụ gửi
      attempted_key TEXT,          -- Giá trị Authorization gửi đến
      matched_user TEXT,           -- Nếu dò được user nào đó
      reason TEXT,                 -- Lý do lỗi (ví dụ: sai api_key, không tìm thấy user)
      payload TEXT,                -- Nội dung webhook (nếu có)
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function insertSepayDonateTable(tx: WebhookSepaySchemaType & {
  email?: string
  display_name?: string
  display_avatar?: string
  user_name?: string
  message?: string
  receiver?: string
  status?: 'error' | 'pending' | 'received'
}) {
  const db = await getDB()
  await initSepayDonateTable()

  await db.execute(
    `INSERT OR IGNORE INTO donate_events (
      code, email, display_name, display_avatar, user_name, message, receiver,
      id_transaction, gateway, transaction_date, account_number, content,
      transfer_type, transfer_amount, accumulated, sub_account,
      reference_code, description, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tx.code,
      tx.email ?? '',
      tx.display_name ?? '',
      tx.display_avatar ?? '',
      tx.user_name ?? '',
      tx.message ?? '',
      tx.receiver ?? '',
      tx.id,
      tx.gateway,
      tx.transactionDate,
      tx.accountNumber,
      tx.content,
      tx.transferType,
      tx.transferAmount,
      tx.accumulated,
      tx.subAccount ?? '',
      tx.referenceCode,
      tx.description,
      tx.status ?? 'pending'
    ]
  )
}

export async function upsertSepayDonateTable(tx: WebhookSepaySchemaType & {
  email?: string
  display_name?: string
  display_avatar?: string
  user_name?: string
  message?: string
  receiver?: string
  status?: 'error' | 'pending' | 'received'
}) {
  const db = await getDB()
  await initSepayDonateTable()

  await db.execute(
    `INSERT INTO donate_events (
      code, email, display_name, display_avatar, user_name, message, receiver,
      id_transaction, gateway, transaction_date, account_number, content,
      transfer_type, transfer_amount, accumulated, sub_account,
      reference_code, description, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      display_avatar = excluded.display_avatar,
      user_name = excluded.user_name,
      message = excluded.message,
      receiver = excluded.receiver,
      id_transaction = excluded.id_transaction,
      gateway = excluded.gateway,
      transaction_date = excluded.transaction_date,
      account_number = excluded.account_number,
      content = excluded.content,
      transfer_type = excluded.transfer_type,
      transfer_amount = excluded.transfer_amount,
      accumulated = excluded.accumulated,
      sub_account = excluded.sub_account,
      reference_code = excluded.reference_code,
      description = excluded.description,
      status = excluded.status
    `,
    [
      tx.code,
      tx.email ?? '',
      tx.display_name ?? '',
      tx.display_avatar ?? '',
      tx.user_name ?? '',
      tx.message ?? '',
      tx.receiver ?? '',
      tx.id,
      tx.gateway,
      tx.transactionDate,
      tx.accountNumber,
      tx.content,
      tx.transferType,
      tx.transferAmount,
      tx.accumulated,
      tx.subAccount ?? '',
      tx.referenceCode,
      tx.description,
      tx.status ?? 'pending'
    ]
  )
}


export async function logWebhookFailure(entry: WebhookLogEntry) {
  const db = await getDB()
  await initWebhookLogTable()

  await db.execute(
    `INSERT INTO webhook_logs (
      source, attempted_key, matched_user, reason, payload
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      entry.source,
      entry.attempted_key,
      entry.matched_user ?? null,
      entry.reason,
      entry.payload ?? ''
    ]
  )
}