import Database from '@tauri-apps/plugin-sql';
import type { SQLiteDiscordUser } from '@/types/data/discord';

let dbInstance: Database | null = null

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await Database.load('sqlite:app.db')
  }
  return dbInstance
}

export async function initDiscordUserTable() {
  const db = await getDB()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      user_name TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      api_key TEXT,
      number TEXT,
      full_name TEXT,
      bank TEXT,
      youtube TEXT,
      facebook TEXT,
      x TEXT,
      avatar TEXT
    )
  `)
}

export async function insertDiscordUser(user: SQLiteDiscordUser) {
  const db = await getDB()
  await initDiscordUserTable()
  await ensureAvatarColumnExists()
  await db.execute(`
    INSERT OR IGNORE INTO users (
      id, name, user_name, email, api_key, number, full_name, bank, youtube, facebook, x, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    user.id,
    user.name,
    user.user_name,
    user.email,
    user.api_key ?? '',
    user.number ?? '',
    user.full_name ?? '',
    user.bank ?? '',
    user.youtube ?? '',
    user.facebook ?? '',
    user.x ?? '',
    user.avatar ?? ''
  ])
}

export async function getDiscordUserByUserName(user_name: string) {
  const db = await getDB()
  await initDiscordUserTable()
  const rows = await db.select<Array<SQLiteDiscordUser>>(
    'SELECT * FROM users WHERE user_name = ?',
    [user_name]
  )

  return rows.length > 0 ? rows[0] : null
}

export async function getAllDiscordUsers<T extends Partial<SQLiteDiscordUser>>(
  select?: Array<keyof SQLiteDiscordUser>
): Promise<Array<T>> {
  const db = await getDB()
  await initDiscordUserTable()

  const columns = select && select.length > 0 ? select.join(', ') : '*'
  const query = `SELECT ${columns} FROM users`

  const rows = await db.select<Array<T>>(query)
  return rows
}

export async function upsertDiscordUser(user: SQLiteDiscordUser) {
  const db = await getDB()
  await initDiscordUserTable()
  await ensureAvatarColumnExists()
  await db.execute(`
    INSERT INTO users (
      id, name, user_name, email, api_key, number, full_name, bank, youtube, facebook, x, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      user_name = excluded.user_name,
      email = excluded.email,
      api_key = excluded.api_key,
      number = excluded.number,
      full_name = excluded.full_name,
      bank = excluded.bank,
      youtube = excluded.youtube,
      facebook = excluded.facebook,
      x = excluded.x,
      avatar = excluded.avatar
  `, [
    user.id,
    user.name,
    user.user_name,
    user.email,
    user.api_key ?? '',
    user.number ?? '',
    user.full_name ?? '',
    user.bank ?? '',
    user.youtube ?? '',
    user.facebook ?? '',
    user.x ?? '',
    user.avatar ?? ''
  ])
}

export async function updateDiscordUser(user: SQLiteDiscordUser) {
  const db = await getDB()
  await initDiscordUserTable()
  await db.execute(`
    UPDATE users SET
      name = ?, user_name = ?, email = ?, api_key = ?, number = ?, full_name = ?, bank = ?, youtube = ?, facebook = ?, x = ?, avatar = ?
    WHERE id = ?
  `, [
    user.name,
    user.user_name,
    user.email,
    user.api_key ?? '',
    user.number ?? '',
    user.full_name ?? '',
    user.bank ?? '',
    user.youtube ?? '',
    user.facebook ?? '',
    user.x ?? '',
    user.avatar ?? '',
    user.id
  ])
}

export async function ensureAvatarColumnExists() {
  const db = await getDB();

  const columns = await db.select<Array<{ name: string }>>(
    `PRAGMA table_info(users)`
  );

  const hasAvatar = columns.some(col => col.name === 'avatar');

  if (!hasAvatar) {
    await db.execute(`ALTER TABLE users ADD COLUMN avatar TEXT`);
    console.log('✅ Đã thêm cột avatar vào bảng users');
  } else {
    console.log('ℹ️ Cột avatar đã tồn tại');
  }
}

export const fallbackData = {
  id: '',
  name: '',
  user_name: '',
  email: '',
  api_key: '',
  number: '',
  full_name: '',
  bank: '',
  youtube: '',
  facebook: '',
  x: '',
  avatar: ''
} as SQLiteDiscordUser