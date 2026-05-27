"use client"

import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData } from "@/app/page"

interface SuccessPageProps {
  formData: FormData
}

export function SuccessPage({ formData }: SuccessPageProps) {
  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Payment Submitted!</h2>
        <p className="mt-2 text-muted-foreground">
          Your payment proof has been received. We will verify and activate your account shortly.
        </p>
      </div>

      {/* Submitted Details */}
      <Card className="bg-card border-border text-left">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Submitted Details</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium text-foreground">{formData.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RPC</span>
              <span className="font-medium text-foreground">{formData.rpc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium text-foreground">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium text-foreground">{formData.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{formData.gmail}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="rounded-lg bg-primary/10 p-4">
        <p className="text-sm text-primary">
          You will receive a confirmation email at <strong>{formData.gmail}</strong> once your account is activated.
        </p>
      </div>
    </div>
  )
}
