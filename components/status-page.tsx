"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SuccessPage } from "@/components/success-page"
import { getSubmissionStatus } from "@/app/actions/submissions"
import type { FormData } from "@/app/page"

interface StatusPageProps {
  submissionId: number | null
  formData: FormData
  onRetry: () => void
}

type Status = "pending" | "accepted" | "declined"

export function StatusPage({ submissionId, formData, onRetry }: StatusPageProps) {
  const [status, setStatus] = useState<Status>("pending")

  useEffect(() => {
    if (!submissionId) return

    let active = true

    const check = async () => {
      try {
        const result = await getSubmissionStatus(submissionId)
        if (active && result) {
          setStatus(result)
        }
      } catch (err) {
        console.error("[v0] Failed to fetch status:", err)
      }
    }

    check()
    const interval = setInterval(check, 4000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [submissionId])

  // Admin approved -> Payment Confirmation
  if (status === "accepted") {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <SuccessPage formData={formData} />
      </div>
    )
  }

  // Admin declined -> Payment Not Received
  if (status === "declined") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 text-center">
          <span className="text-6xl font-bold text-primary">R</span>
          <h1 className="mt-2 text-2xl font-bold text-primary">RedPay</h1>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="mb-8 space-y-3 text-center">
          <h2 className="text-2xl font-bold text-foreground">Payment Not Received</h2>
          <p className="mx-auto max-w-sm text-center text-sm text-muted-foreground">
            We didn&apos;t receive any payment from you. Please make sure the transfer was successful and try uploading
            the payment proof again.
          </p>
        </div>

        <Button onClick={onRetry} className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90">
          Try Again
        </Button>
      </div>
    )
  }

  // Pending -> Awaiting confirmation
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <span className="text-6xl font-bold text-primary">R</span>
        <h1 className="mt-2 text-2xl font-bold text-primary">RedPay</h1>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-foreground">Payment Pending</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Your payment proof has been received and is awaiting confirmation. This page will update automatically once your
        payment is verified.
      </p>

      <div className="mt-6 flex gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
      </div>
    </div>
  )
}
