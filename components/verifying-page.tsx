"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VerifyingPageProps {
  onComplete: () => void
  onRetry?: () => void
}

export function VerifyingPage({ onComplete, onRetry }: VerifyingPageProps) {
  const [verificationFailed, setVerificationFailed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerificationFailed(true)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  if (verificationFailed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        {/* RedPay Logo */}
        <div className="mb-8 text-center">
          <span className="text-6xl font-bold text-primary">R</span>
          <h1 className="mt-2 text-2xl font-bold text-primary">RedPay</h1>
        </div>

        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 text-center space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Payment Not Received</h2>
          <p className="text-center text-sm text-muted-foreground max-w-sm">
            We didn't receive any payment from you. Please make sure the transfer was successful and try uploading the payment proof again.
          </p>
        </div>

        {/* Retry Button */}
        <Button
          onClick={onRetry}
          className="w-full max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* RedPay Logo */}
      <div className="mb-8 text-center">
        <span className="text-6xl font-bold text-primary">R</span>
        <h1 className="mt-2 text-2xl font-bold text-primary">RedPay</h1>
      </div>

      {/* Verifying Animation */}
      <div className="mb-8 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
      </div>

      {/* Verifying Text */}
      <h2 className="mb-2 text-xl font-semibold text-foreground">Verifying Your Payment</h2>
      <p className="text-center text-sm text-muted-foreground">Please wait while we confirm your transaction...</p>

      {/* Animated Dots */}
      <div className="mt-6 flex gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]"></div>
      </div>
    </div>
  )
}
