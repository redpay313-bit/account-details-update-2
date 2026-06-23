import { cookies } from "next/headers"

const ADMIN_EMAIL = "Muyiwa@gmail.com"
const ADMIN_PASSWORD = "admin123"
const SESSION_COOKIE = "redpay_admin_session"
const SESSION_VALUE = "authenticated"

export function verifyCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function createAdminSession() {
  const store = await cookies()
  store.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroyAdminSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
