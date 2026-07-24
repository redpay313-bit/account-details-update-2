"use client"

interface WelcomePageProps {
  onBegin: () => void
}

export function WelcomePage({ onBegin }: WelcomePageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      {/* Logo */}
      <div className="mb-2">
        <span className="text-8xl font-bold text-primary">R</span>
      </div>

      {/* Brand Name */}
      <h2 className="mb-12 text-2xl font-semibold text-primary">RedPay</h2>

      {/* Main Heading */}
      <h1 className="mb-4 text-center text-4xl font-bold text-foreground">
        RedPay
        <br />
        Validation
      </h1>

      {/* Subtitle */}
      <p className="mb-12 text-center text-muted-foreground">Start your verification process.</p>

      {/* Begin Button */}
      <button
        onClick={onBegin}
        className="w-full max-w-xs rounded-xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Begin
      </button>
    </div>
  )
}
