"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { adminLogin } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
    >
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, null)

  return (
    <Card className="rounded-2xl border-muted-foreground/30">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              autoComplete="username"
              required
              className="rounded-xl border-muted-foreground/30 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="rounded-xl border-muted-foreground/30 bg-background"
            />
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
