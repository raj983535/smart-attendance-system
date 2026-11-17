"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Calendar,
  Users,
  BookOpen,
  Filter,
  CheckCircle,
  Loader2,
  Mail,
  Printer,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react"
import { mockStudents, mockSubjects } from "@/lib/mock-data"
import type { User } from "@/lib/types"

interface ReportGeneratorProps {
  user: User
}

interface ReportConfig {
  type: "daily" | "weekly" | "monthly" | "semester" | "student" | "subject" | "custom"
  format: "pdf" | "excel" | "csv"
  startDate: string
  endDate: string
  subjects: string[]
  students: string[]
  includeCharts: boolean
  includeStatistics: boolean
  includeAbsentees: boolean
  groupBySubject: boolean
}

export function ReportGenerator({ user }: ReportGeneratorProps) {
  const [config, setConfig] = useState<ReportConfig>({
    type: "daily",
    format: "pdf",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    subjects: ["all"],
    students: ["all"],
    includeCharts: true,
    includeStatistics: true,
    includeAbsentees: true,
    groupBySubject: false,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedReport, setGeneratedReport] = useState<{
    id: string
    name: string
    size: string
    generatedAt: Date
  } | null>(null)
  const [actionNotice, setActionNotice] = useState("")

  const showToast = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(""), 3500)
  }

  const updateConfig = <K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const generateReport = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedReport(null)

    // Fast simulated steps
    const steps = [
      "Collecting attendance data...",
      "Processing student statistics...",
      "Generating summary curves...",
      "Finalizing document...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350))
      setGenerationProgress((i + 1) * 25)
    }

    const reportName = `${config.type}_attendance_report_${new Date().toISOString().split("T")[0]}.${config.format}`
    setGeneratedReport({
      id: `report_${Date.now()}`,
      name: reportName,
      size: `${Math.floor(Math.random() * 400 + 150)} KB`,
      generatedAt: new Date(),
    })

    setIsGenerating(false)
    setGenerationProgress(100)
    showToast("Report generated! You can now Download, Print, or Email it.")
  }

  const handleDownload = () => {
    if (!generatedReport) return

    const csvContent =
      `Report Type: ${config.type.toUpperCase()}\n` +
      `Date Range: ${config.startDate} to ${config.endDate}\n` +
      `Generated For: ${user.name} (${user.email})\n\n` +
      "Student ID,Name,Subject,Attendance Rate,Exam Eligibility\n" +
      mockStudents
        .map((s, i) => `"${s.studentId}","${s.name}","Core CS",${80 + (i % 18)}%,"${i % 7 === 2 ? "Warning" : "Eligible"}"`)
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", generatedReport.name.replace(/\.[a-z]+$/, ".csv"))
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(`Downloaded ${generatedReport.name} successfully!`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    showToast(`Document sent to ${user.email} and department archive.`)
  }

  return (
    <div className="space-y-6">
      {actionNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {actionNotice}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Custom Report Generation Engine</h2>
        <p className="text-xs text-gray-600">Configure parameters, date bounds, and export formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold">Report Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Report Scope</Label>
                <Select value={config.type} onValueChange={(val: any) => updateConfig("type", val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Attendance</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="monthly">Monthly Aggregate</SelectItem>
                    <SelectItem value="semester">Full Semester Cumulative</SelectItem>
                    <SelectItem value="student">Student Performance Profile</SelectItem>
                    <SelectItem value="subject">Subject-wise Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Export Format</Label>
                <Select value={config.format} onValueChange={(val: any) => updateConfig("format", val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV Data (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => updateConfig("startDate", e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => updateConfig("endDate", e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Target Courses</Label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Courses (Default)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses (6 Subjects)</SelectItem>
                  {mockSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Options & Inclusions */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold">Report Inclusions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={config.includeCharts}
                onCheckedChange={(checked) => updateConfig("includeCharts", !!checked)}
              />
              <Label htmlFor="includeCharts" className="text-xs cursor-pointer">
                Include visual performance charts
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeStatistics"
                checked={config.includeStatistics}
                onCheckedChange={(checked) => updateConfig("includeStatistics", !!checked)}
              />
              <Label htmlFor="includeStatistics" className="text-xs cursor-pointer">
                Include class averages and metrics
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAbsentees"
                checked={config.includeAbsentees}
                onCheckedChange={(checked) => updateConfig("includeAbsentees", !!checked)}
              />
              <Label htmlFor="includeAbsentees" className="text-xs cursor-pointer">
                Highlight at-risk absentees (&lt;75%)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="groupBySubject"
                checked={config.groupBySubject}
                onCheckedChange={(checked) => updateConfig("groupBySubject", !!checked)}
              />
              <Label htmlFor="groupBySubject" className="text-xs cursor-pointer">
                Group output by subject
              </Label>
            </div>

            <div className="pt-4 border-t">
              <p className="text-[11px] text-gray-500">
                Generated document conforms to academic accreditation standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Progress Indicator */}
      {isGenerating && (
        <Card className="border-blue-200 bg-blue-50/70 animate-in fade-in">
          <CardContent className="p-5">
            <div className="flex items-center space-x-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900">Compiling Institutional Attendance Data...</h4>
                <Progress value={generationProgress} className="mt-2 h-2" />
                <p className="text-xs text-blue-700 mt-1">{generationProgress}% completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Report Ready Banner */}
      {generatedReport && (
        <Card className="border-green-300 bg-green-50/70 animate-in fade-in">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-green-950">{generatedReport.name}</h4>
                  <p className="text-xs text-green-800">
                    File size: {generatedReport.size} • Ready for download
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="bg-white text-xs h-8" onClick={handleEmail}>
                  <Mail className="h-3.5 w-3.5 mr-1 text-blue-600" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="bg-white text-xs h-8" onClick={handlePrint}>
                  <Printer className="h-3.5 w-3.5 mr-1 text-gray-600" />
                  Print
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs h-8" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Generate Button */}
      <div>
        <Button
          onClick={generateReport}
          disabled={isGenerating}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing Records...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 mr-2" />
              Generate Attendance Report
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
