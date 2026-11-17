"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  FileSpreadsheet,
} from "lucide-react"

interface DummyReport {
  id: string
  title: string
  type: string
  description: string
  generatedDate: string
  size: string
  status: "ready" | "generating" | "scheduled"
  icon: any
  color: string
}

const dummyReports: DummyReport[] = [
  {
    id: "1",
    title: "Monthly Attendance Summary - Spring Semester",
    type: "Monthly Report",
    description: "Comprehensive attendance analysis across all students and enrolled courses",
    generatedDate: "2024-12-15",
    size: "2.4 MB",
    status: "ready",
    icon: Calendar,
    color: "blue",
  },
  {
    id: "2",
    title: "Student Performance & Attendance Analytics",
    type: "Analytics Report",
    description: "Individual student attendance trends, lecture attendance, and performance tiers",
    generatedDate: "2024-12-14",
    size: "1.8 MB",
    status: "ready",
    icon: TrendingUp,
    color: "green",
  },
  {
    id: "3",
    title: "Subject-wise Attendance Breakdown Roster",
    type: "Subject Report",
    description: "Detailed analysis of attendance patterns across CS301, CS302, CS401, CS304",
    generatedDate: "2024-12-13",
    size: "3.1 MB",
    status: "ready",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "4",
    title: "At-Risk & Low Attendance Warning Report",
    type: "Alert Report",
    description: "List of students with attendance below 75% requiring official intervention",
    generatedDate: "2024-12-12",
    size: "856 KB",
    status: "ready",
    icon: AlertCircle,
    color: "orange",
  },
  {
    id: "5",
    title: "Daily Attendance Verification - Live Session",
    type: "Daily Report",
    description: "Real-time biometric attendance verified for current morning classes",
    generatedDate: "2024-12-15",
    size: "1.2 MB",
    status: "ready",
    icon: Clock,
    color: "blue",
  },
  {
    id: "6",
    title: "Semester Final Audit Report",
    type: "Semester Report",
    description: "Complete term-end attendance logs for exam registration eligibility",
    generatedDate: "2024-12-20",
    size: "4.5 MB",
    status: "ready",
    icon: Users,
    color: "gray",
  },
]

export function DummyReports() {
  const [selectedReport, setSelectedReport] = useState<DummyReport | null>(null)
  const [previewModalReport, setPreviewModalReport] = useState<DummyReport | null>(null)
  const [downloadNotice, setDownloadNotice] = useState("")

  const showToast = (msg: string) => {
    setDownloadNotice(msg)
    setTimeout(() => setDownloadNotice(""), 3500)
  }

  const handleDownloadFile = (report: DummyReport, format = "csv") => {
    const csvContent =
      "Report Name,Type,Generated Date,Status,Verified By\n" +
      `"${report.title}","${report.type}","${report.generatedDate}","VERIFIED","Academic Office"` +
      "\n\nStudent ID,Name,Subject,Attendance %,Status\n" +
      '"CS2021001","Sahil Kumar","Core CS",88%,"Eligible"\n' +
      '"CS2021002","Sujit Sharma","Core CS",92%,"Eligible"\n' +
      '"CS2021003","Manu Gupta","Core CS",68%,"Warning"\n' +
      '"CS2021004","Raj Patel","Core CS",85%,"Eligible"\n' +
      '"CS2021005","Sukla Singh","Core CS",95%,"Eligible"\n'

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${format}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(`Downloaded '${report.title}' as .${format}!`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Generating</Badge>
      case "scheduled":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "border-l-blue-500 hover:bg-blue-50/50"
      case "green":
        return "border-l-green-500 hover:bg-green-50/50"
      case "purple":
        return "border-l-purple-500 hover:bg-purple-50/50"
      case "orange":
        return "border-l-orange-500 hover:bg-orange-50/50"
      default:
        return "border-l-gray-500 hover:bg-gray-50/50"
    }
  }

  return (
    <div className="space-y-6">
      {downloadNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {downloadNotice}
        </div>
      )}

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="flex items-center space-x-2 text-base">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Generated Academic Attendance Reports</span>
          </CardTitle>
          <CardDescription>Instant preview and export of verified institutional records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dummyReports.map((report) => {
            const IconComponent = report.icon
            return (
              <Card
                key={report.id}
                className={`border-l-4 cursor-pointer transition-all ${getColorClasses(report.color)}`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-lg bg-gray-100 mt-0.5">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{report.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{report.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                          <span>Generated: {report.generatedDate}</span>
                          <span>•</span>
                          <span>Size: {report.size}</span>
                          <span>•</span>
                          <span>Type: {report.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {getStatusBadge(report.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-xs bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewModalReport(report)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-blue-600" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-2.5 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadFile(report, "csv")
                        }}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Selected Report Quick Actions Panel */}
      {selectedReport && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 animate-in fade-in">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <span className="flex items-center space-x-2 text-sm font-semibold text-blue-950">
              <selectedReport.icon className="h-4 w-4 text-blue-600" />
              <span>Selected Document: {selectedReport.title}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedReport(null)}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <p className="text-xs text-gray-600">{selectedReport.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs"
                onClick={() => handleDownloadFile(selectedReport, "csv")}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV Data
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-xs"
                onClick={() => setPreviewModalReport(selectedReport)}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Inspect Full Table
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-xs"
                onClick={() => {
                  window.print()
                }}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-600" />
                Print / Save PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Report Table Preview Modal */}
      {previewModalReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">{previewModalReport.title}</h3>
              </div>
              <button
                onClick={() => setPreviewModalReport(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-gray-500">Document Type:</span>
                <p className="font-semibold text-gray-900">{previewModalReport.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Date Generated:</span>
                <p className="font-semibold text-gray-900">{previewModalReport.generatedDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Format:</span>
                <p className="font-semibold text-green-700">Verified Institutional Data</p>
              </div>
            </div>

            {/* Mock Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Roll No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Classes Attended</th>
                    <th className="p-2.5">Attendance %</th>
                    <th className="p-2.5">Exam Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2.5 font-mono">CS2021001</td>
                    <td className="p-2.5 font-medium">Sahil Kumar</td>
                    <td className="p-2.5">42 / 48</td>
                    <td className="p-2.5 font-bold text-green-700">88%</td>
                    <td className="p-2.5"><Badge className="bg-green-600 text-[10px]">Eligible</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">CS2021002</td>
                    <td className="p-2.5 font-medium">Sujit Sharma</td>
                    <td className="p-2.5">44 / 48</td>
                    <td className="p-2.5 font-bold text-green-700">92%</td>
                    <td className="p-2.5"><Badge className="bg-green-600 text-[10px]">Eligible</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">CS2021003</td>
                    <td className="p-2.5 font-medium">Manu Gupta</td>
                    <td className="p-2.5">32 / 48</td>
                    <td className="p-2.5 font-bold text-red-600">68%</td>
                    <td className="p-2.5"><Badge variant="destructive" className="text-[10px]">Shortage</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">CS2021004</td>
                    <td className="p-2.5 font-medium">Raj Patel</td>
                    <td className="p-2.5">41 / 48</td>
                    <td className="p-2.5 font-bold text-green-700">85%</td>
                    <td className="p-2.5"><Badge className="bg-green-600 text-[10px]">Eligible</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">CS2021005</td>
                    <td className="p-2.5 font-medium">Sukla Singh</td>
                    <td className="p-2.5">46 / 48</td>
                    <td className="p-2.5 font-bold text-green-700">95%</td>
                    <td className="p-2.5"><Badge className="bg-green-600 text-[10px]">Eligible</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex space-x-2 pt-2 border-t">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  handleDownloadFile(previewModalReport, "csv")
                  setPreviewModalReport(null)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Full Sheet (.CSV)
              </Button>
              <Button variant="outline" onClick={() => setPreviewModalReport(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
