"use server"

import { sql, type Submission } from "@/lib/db"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export interface NewSubmission {
  fullName: string
  phoneNumber: string
  gmail: string
  bank: string
  accountNumber: string
  rpc: string
  amount: string
  receiptData: string | null
}

export async function createSubmission(data: NewSubmission) {
  const rows = (await sql`
    INSERT INTO submissions
      (full_name, phone_number, gmail, bank, account_number, rpc, amount, receipt_data, status)
    VALUES
      (${data.fullName}, ${data.phoneNumber}, ${data.gmail}, ${data.bank},
       ${data.accountNumber}, ${data.rpc}, ${data.amount}, ${data.receiptData}, 'pending')
    RETURNING id
  `) as { id: number }[]

  revalidatePath("/admin")
  return { id: rows[0]?.id }
}

export async function getSubmissions(): Promise<Submission[]> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized")
  }
  const rows = (await sql`
    SELECT * FROM submissions ORDER BY created_at DESC
  `) as Submission[]
  return rows
}

export async function updateSubmissionStatus(id: number, status: "accepted" | "declined") {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized")
  }
  await sql`
    UPDATE submissions SET status = ${status} WHERE id = ${id}
  `
  revalidatePath("/admin")
}
