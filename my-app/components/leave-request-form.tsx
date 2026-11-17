"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Send, Calendar } from "lucide-react"
import type { LeaveRequest } from "@/lib/types"

interface LeaveRequestFormProps {
  studentId: string
  onSubmitSuccess?: (newLeave: LeaveRequest) => void
}

export function LeaveRequestForm({ studentId, onSubmitSuccess }: LeaveRequestFormProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const facultyMembers = [
    { id: "1", name: "Dr. Sarah Wilson", department: "Computer Science" },
    { id: "2", name: "Prof. Michael Johnson", department: "Computer Science" },
    { id: "3", name: "Dr. Rajesh Kumar", department: "Information Technology" },
    { id: "4", name: "Prof. Priya Sharma", department: "Mathematics" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API network call
    await new Promise((resolve) => setTimeout(resolve, 600))

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      studentId: studentId || "student-1",
      startDate: new Date(startDate || Date.now()),
      endDate: new Date(endDate || Date.now() + 86400000),
      reason: reason || "Personal leave request",
      status: "pending",
      submittedAt: new Date(),
    }

    if (onSubmitSuccess) {
      onSubmitSuccess(newLeave)
    }

    setSubmitted(true)
    setIsSubmitting(false)

    // Reset fields
    setStartDate("")
    setEndDate("")
    setReason("")

    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitted && (
        <Alert className="border-green-200 bg-green-50 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            Leave request submitted successfully! Your faculty advisor has been notified.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="faculty">Reviewing Faculty</Label>
        <Select value={selectedFaculty} onValueChange={setSelectedFaculty} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Choose faculty advisor" />
          </SelectTrigger>
          <SelectContent>
            {facultyMembers.map((faculty) => (
              <SelectItem key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.department})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Absence</Label>
        <Textarea
          id="reason"
          placeholder="e.g. Attending hackathon, medical leave, or personal family event..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Leave Application"}
      </Button>
    </form>
  )
}
