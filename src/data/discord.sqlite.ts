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
  await db.execute(`
    INSERT INTO users (
      id, name, user_name, email, api_key, number, full_name, bank, youtube, facebook, x, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = CASE WHEN excluded.name != '' THEN excluded.name ELSE users.name END,
      user_name = CASE WHEN excluded.user_name != '' THEN excluded.user_name ELSE users.user_name END,
      email = CASE WHEN excluded.email != '' THEN excluded.email ELSE users.email END,
      api_key = CASE WHEN excluded.api_key != '' THEN excluded.api_key ELSE users.api_key END,
      number = CASE WHEN excluded.number != '' THEN excluded.number ELSE users.number END,
      full_name = CASE WHEN excluded.full_name != '' THEN excluded.full_name ELSE users.full_name END,
      bank = CASE WHEN excluded.bank != '' THEN excluded.bank ELSE users.bank END,
      youtube = excluded.youtube,
      facebook = excluded.facebook,
      x = excluded.x,
      avatar = CASE WHEN excluded.avatar != '' THEN excluded.avatar ELSE users.avatar END
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