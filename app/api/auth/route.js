import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

export async function POST(req) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'מייל חסר' }, { status: 400 })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  await pool.query(`INSERT INTO customers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`, [email])
  const { rows } = await pool.query(`SELECT id FROM customers WHERE email = $1`, [email])
  const customerId = rows[0].id

  const token = Buffer.from(JSON.stringify({ customerId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64')

  return NextResponse.json({ token, customerId })
}
