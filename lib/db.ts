import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export interface Submission {
  id: number
  full_name: string
  phone_number: string
  gmail: string
  bank: string
  account_number: string
  rpc: string
  amount: string
  receipt_data: string | null
  status: "pending" | "accepted" | "declined"
  created_at: string
}
