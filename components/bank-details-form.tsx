"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import type { FormData } from "@/app/page"

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Moniepoint",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
]

interface BankDetailsFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
  initialData: FormData
}

export function BankDetailsForm({ onSubmit, onBack, initialData }: BankDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.bank) newErrors.bank = "Please select a bank"
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{10}$/.test(formData.accountNumber.replace(/\s/g, ""))) {
      newErrors.accountNumber = "Enter a valid 10-digit account number"
    }
    if (!formData.rpc.trim()) {
      newErrors.rpc = "RPC is required"
    } else if (formData.rpc.trim().toUpperCase() !== "RPC607") {
      newErrors.rpc = "Invalid RPC"
    }
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Enter a valid phone number"
    }
    if (!formData.gmail.trim()) {
      newErrors.gmail = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
      newErrors.gmail = "Enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-4 text-center">
        <h1 className="text-3xl font-bold italic text-primary">RedPay</h1>
        <p className="text-muted-foreground">Activation</p>
      </div>

      {/* Red Divider */}
      <div className="mx-6 h-0.5 bg-primary" />

      {/* Form Card */}
      <div className="flex-1 p-6">
        <div className="rounded-2xl border border-muted-foreground/30 p-6">
          <h2 className="text-xl font-bold text-foreground">Account Details</h2>
          <p className="mb-6 text-muted-foreground">Enter your banking information</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank" className="font-semibold">
                Select Bank
              </Label>
              <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
                <SelectTrigger id="bank" className="rounded-xl border-muted-foreground/30 bg-background">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bank && <p className="text-sm text-destructive">{errors.bank}</p>}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="font-semibold">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="tel"
                inputMode="numeric"
                placeholder="Enter your 10-digit account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="rounded-xl border-muted-foreground/30 bg-background"
              />
              {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
            </div>

            {/* RPC */}
            <div className="space-y-2">
              <Label htmlFor="rpc" className="font-semibold">
                RPC (Referral/Promo Code)
              </Label>
              <Input
                id="rpc"
                placeholder="Enter RPC"
                value={formData.rpc}
                onChange={(e) => setFormData({ ...formData, rpc: e.target.value })}
                className="rounded-xl border-muted-foreground/30 bg-background"
              />
              {errors.rpc && <p className="text-sm text-destructive">{errors.rpc}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="rounded-xl border-muted-foreground/30 bg-background"
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-semibold">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="rounded-xl border-muted-foreground/30 bg-background"
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="gmail" className="font-semibold">
                Email
              </Label>
              <Input
                id="gmail"
                type="email"
                placeholder="Enter your email"
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                className="rounded-xl border-muted-foreground/30 bg-background"
              />
              {errors.gmail && <p className="text-sm text-destructive">{errors.gmail}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl bg-primary py-6 text-lg font-semibold hover:bg-primary/90 text-primary-foreground"
            >
              Continue to Payment
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
