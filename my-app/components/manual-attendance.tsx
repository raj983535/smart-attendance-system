"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Users, Save, ArrowLeft, Download, Calendar, CheckCheck } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"

const engineeringSubjects = [
  "Data Structures & Algorithms (CS301)",
  "Database Management Systems (CS302)",
  "Machine Learning & AI (CS401)",
  "Computer Networks (CS304)",
  "Operating Systems (CS305)",
  "Web Development Technologies (CS306)",
]

interface AttendanceRecord {
  id: string
  studentName: string
  studentId: string
  status: "present" | "absent" | null
}

interface ManualAttendanceProps {
  onBack: () => void
}

export function ManualAttendance({ onBack }: ManualAttendanceProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>(engineeringSubjects[0])
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [successToast, setSuccessToast] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    mockStudents.map((s) => ({
      id: s.id,
      studentName: s.name,
      studentId: s.studentId,
      status: "present", // Pre-fill with present for convenience
    })),
  )

  const handleAttendanceChange = (studentId: string, status: "present" | "absent") => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.id === studentId ? { ...record, status } : record)),
    )
  }

  const handleSaveAttendance = () => {
    const presentCount = attendanceRecords.filter((r) => r.status === "present").length
    const absentCount = attendanceRecords.filter((r) => r.status === "absent").length

    setSuccessToast(
      `Attendance successfully recorded for ${selectedSubject} on ${attendanceDate}!\nSummary: ${presentCount} Present, ${absentCount} Absent.`,
    )
    setTimeout(() => setSuccessToast(""), 5000)
  }

  const handleDownloadSheet = () => {
    const csvContent =
      "Student ID,Name,Subject,Date,Status\n" +
      attendanceRecords
        .map(
          (r) =>
            `"${r.studentId}","${r.studentName}","${selectedSubject}","${attendanceDate}","${(r.status || "unmarked").toUpperCase()}"`,
        )
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `attendance_${selectedSubject.split(" ")[0]}_${attendanceDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const presentCount = attendanceRecords.filter((r) => r.status === "present").length
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length
  const totalMarked = presentCount + absentCount

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Manual Attendance Register</h1>
            <p className="text-xs text-muted-foreground">Roll-call checklist for classroom lecture logging</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownloadSheet}>
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
          <Button
            onClick={handleSaveAttendance}
            disabled={!selectedSubject || totalMarked === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-lg text-sm flex items-start space-x-3 animate-in fade-in">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="whitespace-pre-line font-medium">{successToast}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Card */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Lecture & Session Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Course / Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineeringSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Lecture Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Checklist Table */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Student Roster ({attendanceRecords.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Mark each student as Present or Absent for this lecture
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "present" })))}
                >
                  All Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "absent" })))}
                >
                  All Absent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2.5">
                {attendanceRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      record.status === "present"
                        ? "bg-green-50/40 border-green-200"
                        : record.status === "absent"
                          ? "bg-red-50/40 border-red-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-gray-400 w-5">{index + 1}.</span>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xs text-blue-700">
                        {record.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900">{record.studentName}</span>
                        <p className="text-[11px] font-mono text-gray-500">{record.studentId}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={record.status === "present" ? "default" : "outline"}
                        onClick={() => handleAttendanceChange(record.id, "present")}
                        className={`h-8 text-xs ${
                          record.status === "present"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "hover:bg-green-50 text-green-700"
                        }`}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={record.status === "absent" ? "default" : "outline"}
                        onClick={() => handleAttendanceChange(record.id, "absent")}
                        className={`h-8 text-xs ${
                          record.status === "absent"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "hover:bg-red-50 text-red-700"
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary & Batch Tools */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Enrolled</span>
                <Badge variant="outline">{attendanceRecords.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Present</span>
                <Badge className="bg-green-600 font-bold">{presentCount}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Absent</span>
                <Badge className="bg-red-600 font-bold">{absentCount}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Unmarked</span>
                <Badge variant="secondary">{attendanceRecords.length - totalMarked}</Badge>
              </div>
              <div className="pt-3 border-t flex items-center justify-between text-sm font-bold">
                <span>Attendance Rate</span>
                <span className="text-blue-600">
                  {totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Quick Batch Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs bg-transparent"
                onClick={() => setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "present" })))}
              >
                <CheckCheck className="h-3.5 w-3.5 mr-2 text-green-600" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs bg-transparent"
                onClick={() => setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "absent" })))}
              >
                <XCircle className="h-3.5 w-3.5 mr-2 text-red-600" />
                Mark All Absent
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs bg-transparent text-gray-500"
                onClick={() => setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: null })))}
              >
                Reset All Statuses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
