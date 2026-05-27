"use client"

import { useEffect } from "react"

interface ProcessingPageProps {
  onComplete: () => void
}

export function ProcessingPage({ onComplete }: ProcessingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* RedPay Logo */}
      <div className="mb-8 text-center">
        <span className="text-6xl font-bold text-primary">R</span>
        <h1 className="mt-2 text-2xl font-bold text-primary">RedPay</h1>
      </div>

      {/* Processing Animation */}
      <div className="mb-8 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
      </div>

      {/* Processing Text */}
      <h2 className="mb-2 text-xl font-semibold text-foreground">Processing</h2>
      <p className="text-center text-sm text-muted-foreground">Please wait while we verify your details...</p>

      {/* Animated Dots */}
      <div className="mt-6 flex gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]"></div>
      </div>
    </div>
  )
}
