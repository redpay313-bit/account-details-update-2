import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getSubmissions } from "@/app/actions/submissions"
import { adminLogout } from "@/app/actions/admin"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const submissions = await getSubmissions()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">RedPay Activation</p>
            </div>
          </div>
          <form action={adminLogout}>
            <Button variant="outline" size="sm" type="submit" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <AdminDashboard submissions={submissions} />
      </div>
    </main>
  )
}
