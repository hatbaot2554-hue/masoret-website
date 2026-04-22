import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: Request) {
  const { email, productIndex, productName } = await req.json()
  if (!email || productIndex === undefined) {
    return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        product_index INTEGER NOT NULL,
        product_name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        notified BOOLEAN DEFAULT FALSE,
        UNIQUE(email, product_index)
      )
    `)
    await pool.query(
      `INSERT INTO waitlist (email, product_index, product_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email, product_index) DO NOTHING`,
      [email, productIndex, productName || '']
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'שגיאה' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, email, product_index as "productIndex", product_name as "productName"
       FROM waitlist WHERE notified = FALSE`
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}
