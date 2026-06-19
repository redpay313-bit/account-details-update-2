"use client"

import { useState, useTransition } from "react"
import type { Submission } from "@/lib/db"
import { updateSubmissionStatus } from "@/app/actions/submissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Receipt, Inbox } from "lucide-react"

type Filter = "all" | "pending" | "accepted" | "declined"

function StatusBadge({ status }: { status: Submission["status"] }) {
  if (status === "accepted") {
    return <Badge className="bg-green-600 text-white hover:bg-green-600">Accepted</Badge>
  }
  if (status === "declined") {
    return <Badge variant="destructive">Declined</Badge>
  }
  return <Badge variant="secondary">Pending</Badge>
}

function SubmissionCard({ submission }: { submission: Submission }) {
  const [isPending, startTransition] = useTransition()

  const handleStatus = (status: "accepted" | "declined") => {
    startTransition(async () => {
      await updateSubmissionStatus(submission.id, status)
    })
  }

  const details: { label: string; value: string }[] = [
    { label: "Phone", value: submission.phone_number },
    { label: "Email", value: submission.gmail },
    { label: "Bank", value: submission.bank },
    { label: "Account No.", value: submission.account_number },
    { label: "RPC", value: submission.rpc },
    { label: "Amount", value: submission.amount || "—" },
  ]

  return (
    <Card className="rounded-2xl border-muted-foreground/30">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-foreground">{submission.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={submission.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {details.map((d) => (
            <div key={d.label}>
              <p className="text-xs text-muted-foreground">{d.label}</p>
              <p className="break-words text-sm font-medium text-foreground">{d.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {submission.receipt_data ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Receipt className="h-4 w-4" />
                  View Receipt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Receipt — {submission.full_name}</DialogTitle>
                </DialogHeader>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={submission.receipt_data || "/placeholder.svg"}
                  alt={`Receipt uploaded by ${submission.full_name}`}
                  className="max-h-[70vh] w-full rounded-lg object-contain"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-xs text-muted-foreground">No receipt uploaded</span>
          )}

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending || submission.status === "declined"}
              onClick={() => handleStatus("declined")}
              className="gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Decline
            </Button>
            <Button
              size="sm"
              disabled={isPending || submission.status === "accepted"}
              onClick={() => handleStatus("accepted")}
              className="gap-1 bg-green-600 text-white hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboard({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState<Filter>("all")

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    accepted: submissions.filter((s) => s.status === "accepted").length,
    declined: submissions.filter((s) => s.status === "declined").length,
  }

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter)

  return (
    <div className="space-y-5">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({counts.accepted})</TabsTrigger>
          <TabsTrigger value="declined">Declined ({counts.declined})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted-foreground/30 py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No submissions to show</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  )
}
