"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, Upload, ImageIcon, Loader2, AlertCircle } from "lucide-react"

interface PaymentPageProps {
  onSubmit: (proof: File) => void
  onBack: () => void
  isSaving?: boolean
  saveError?: string | null
}

const PAYMENT_DETAILS = {
  amount: "₦25,500",
  accountNumber: "1031928326",
  bankName: "Guaranty Trust Bank",
  accountName: "ABAYOMI AKINBO",
}

export function PaymentPage({ onSubmit, onBack, isSaving = false, saveError = null }: PaymentPageProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file such as PNG or JPG.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("The receipt image must be 10MB or smaller.")
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setFileError(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Payment Amount */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Amount to Pay</p>
        <p className="text-4xl font-bold text-primary">{PAYMENT_DETAILS.amount}</p>
      </div>

      {/* Payment Details Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Transfer to this account</h3>

          {/* Account Number */}
          <div className="flex items-center justify-between rounded-lg bg-input p-3">
            <div>
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-mono text-lg font-semibold text-foreground">{PAYMENT_DETAILS.accountNumber}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(PAYMENT_DETAILS.accountNumber, "account")}
              className="text-primary hover:text-primary/80"
            >
              {copiedField === "account" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>

          {/* Bank Name */}
          <div className="flex items-center justify-between rounded-lg bg-input p-3">
            <div>
              <p className="text-xs text-muted-foreground">Bank Name</p>
              <p className="font-semibold text-foreground">{PAYMENT_DETAILS.bankName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(PAYMENT_DETAILS.bankName, "bank")}
              className="text-primary hover:text-primary/80"
            >
              {copiedField === "bank" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between rounded-lg bg-input p-3">
            <div>
              <p className="text-xs text-muted-foreground">Account Name</p>
              <p className="font-semibold text-foreground">{PAYMENT_DETAILS.accountName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(PAYMENT_DETAILS.accountName, "name")}
              className="text-primary hover:text-primary/80"
            >
              {copiedField === "name" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Payment Proof */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Upload Payment Proof</h3>
        <p className="text-sm text-muted-foreground">Please upload a screenshot of your transfer confirmation</p>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        {previewUrl ? (
          <div className="relative rounded-lg border border-border overflow-hidden">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Payment proof preview"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm font-medium text-foreground">Change Image</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-border bg-input p-8 text-center hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Click to upload screenshot</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          </button>
        )}
      </div>

      {/* Error message */}
      {(fileError || saveError) && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{fileError || saveError}</p>
        </div>
      )}
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedFile || isSaving}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting receipt...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />I have made the payment
          </>
        )}
      </Button>
    </div>
  )
}
