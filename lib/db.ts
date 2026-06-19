import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Resolve the connection string from any of the names the Neon integration may use,
// so a transient missing DATABASE_URL doesn't crash the whole app at import time.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING

let _sql: NeonQueryFunction<false, false> | null = connectionString ? neon(connectionString) : null

// Lazy, fail-safe accessor: throws only when a query is actually attempted without a connection,
// instead of breaking module evaluation (which previously 500'd the entire /admin route).
export const sql = ((...args: Parameters<NeonQueryFunction<false, false>>) => {
  if (!_sql) {
    const cs =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING
    if (!cs) {
      throw new Error("Database connection string is not configured (DATABASE_URL).")
    }
    _sql = neon(cs)
  }
  // @ts-expect-error - forwarding tagged-template / query args to the Neon client
  return _sql(...args)
}) as unknown as NeonQueryFunction<false, false>

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
