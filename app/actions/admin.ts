"use server"

import { verifyCredentials, createAdminSession, destroyAdminSession } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export async function adminLogin(_prev: { error: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!verifyCredentials(email, password)) {
    return { error: "Invalid email or password" }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function adminLogout() {
  await destroyAdminSession()
  redirect("/admin/login")
}
