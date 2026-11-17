"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  X,
  FileSpreadsheet,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AttendanceChart } from "@/components/attendance-chart"
import { SubjectAttendanceChart } from "@/components/subject-attendance-chart"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DummyReports } from "@/components/dummy-reports"
import { mockAttendanceRecords, mockSubjects, mockLeaveRequests } from "@/lib/mock-data"
import { calculateAttendanceStats, getAttendanceColor, getAttendanceStatus } from "@/lib/attendance-utils"
import type { Student, AttendanceStats, LeaveRequest } from "@/lib/types"

export function StudentDashboard() {
  const { user } = useAuth()
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<{
    subjectId: string
    subjectName: string
    percentage: number
    present: number
    total: number
  } | null>(null)
  const [reportModalData, setReportModalData] = useState<{
    title: string
    description: string
    downloadUrl?: string
  } | null>(null)
  const [downloadNotice, setDownloadNotice] = useState<string>("")

  useEffect(() => {
    if (user && user.role === "student") {
      const student = user as Student
      const stats = calculateAttendanceStats(student.id, mockAttendanceRecords, mockSubjects)
      setAttendanceStats(stats)

      // Get leaves
      const studentLeaves = mockLeaveRequests.filter(
        (req) => req.studentId === student.id || req.studentId === "student-1",
      )
      setLeaveRequests(studentLeaves.length > 0 ? studentLeaves : mockLeaveRequests.slice(0, 2))
    }
  }, [user])

  if (!user || user.role !== "student" || !attendanceStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const student = user as Student

  const handleAddLeave = (newLeave: LeaveRequest) => {
    setLeaveRequests((prev) => [newLeave, ...prev])
  }

  const handleReportClick = (reportType: string) => {
    setReportModalData({
      title: `${reportType} - ${student.name}`,
      description: `Generated on ${new Date().toLocaleDateString()} for Student ID: ${student.studentId || "CS2021001"}. Includes subject attendance, leaves taken, and performance trends.`,
    })
  }

  const handleAnalyticsClick = () => {
    setActiveSection("analytics")
  }

  const triggerDownload = (format: string) => {
    const csvContent =
      "Subject,Total Classes,Classes Attended,Percentage,Status\n" +
      attendanceStats.subjectWiseAttendance
        .map((s) => `"${s.subjectName}",${s.total},${s.present},${s.percentage}%,"${s.percentage >= 75 ? "Eligible" : "Warning"}"`)
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `student_attendance_${student.name.replace(/\s+/g, "_")}.${format.toLowerCase()}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloadNotice(`Downloaded ${format} report successfully!`)
    setTimeout(() => setDownloadNotice(""), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {downloadNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {downloadNotice}
        </div>
      )}

      {/* Welcome Section */}
      <div
        className="rounded-xl p-6 shadow-sm border border-blue-800/20"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
          color: "#ffffff",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                Welcome back, {student.name}!
              </h1>
              <span className="bg-blue-500/40 text-blue-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Active Student
              </span>
            </div>
            <p className="mt-1 text-sm text-blue-100">
              ID: {student.studentId || "CS2021001"} • {student.department || "Computer Science"} • Semester 6 (Batch 2021-25)
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              onClick={() => setActiveSection("leave")}
            >
              Apply Leave
            </Button>
            <Button
              size="sm"
              className="bg-white text-blue-900 hover:bg-blue-50 font-semibold"
              onClick={() => handleReportClick("Term Attendance Summary")}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-600"
          onClick={() => setActiveSection("overview")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.attendancePercentage}%</div>
            <p className={`text-xs font-semibold ${getAttendanceColor(attendanceStats.attendancePercentage)}`}>
              {getAttendanceStatus(attendanceStats.attendancePercentage)} Standing
            </p>
            <Progress value={attendanceStats.attendancePercentage} className="mt-2.5" />
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-600"
          onClick={() => setActiveSection("subjects")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Classes Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">out of {attendanceStats.totalClasses} scheduled lectures</p>
            <div className="text-xs text-green-700 font-medium mt-2">
              {attendanceStats.totalClasses - attendanceStats.attendedClasses} missed
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-600"
          onClick={() => setActiveSection("subjects")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockSubjects.length}</div>
            <p className="text-xs text-muted-foreground">Semester 6 curriculum</p>
            <p className="text-xs text-blue-600 font-medium mt-2">All course criteria met</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500"
          onClick={() => setActiveSection("leave")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Leave Requests</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{leaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {leaveRequests.filter((req) => req.status === "pending").length} pending approval
            </p>
            <p className="text-xs text-orange-600 font-medium mt-2">Click to view/apply</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects ({mockSubjects.length})</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests ({leaveRequests.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports Hub</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Your daily attendance frequency over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart studentId={student.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Comparative attendance across all current courses</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectAttendanceChart data={attendanceStats.subjectWiseAttendance} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Class Attendance Activity</CardTitle>
                <CardDescription>Your latest recorded attendance marks</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerDownload("csv")}
                className="text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAttendanceRecords.slice(0, 6).map((record) => {
                  const subject = mockSubjects.find((s) => s.id === record.subjectId)
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            record.status === "present"
                              ? "bg-green-100"
                              : record.status === "late"
                                ? "bg-orange-100"
                                : "bg-red-100"
                          }`}
                        >
                          {record.status === "present" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : record.status === "late" ? (
                            <Clock className="h-4 w-4 text-orange-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{subject?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()} • {record.status === "present" ? "Verified via Biometric" : "Standard Log"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          record.status === "present"
                            ? "bg-green-600"
                            : record.status === "late"
                              ? "bg-orange-500"
                              : "bg-red-600"
                        }
                      >
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceStats.subjectWiseAttendance.map((subject) => (
              <Card
                key={subject.subjectId}
                className="cursor-pointer hover:shadow-lg transition-all border-gray-200 hover:border-blue-300"
                onClick={() => setSelectedSubjectModal(subject)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {subject.subjectName}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {subject.present} of {subject.total} classes attended
                      </CardDescription>
                    </div>
                    <Badge variant={subject.percentage >= 75 ? "default" : "destructive"}>
                      {subject.percentage >= 75 ? "Eligible" : "Shortage"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{subject.percentage}%</span>
                      <span className="text-xs text-muted-foreground font-medium">Req: 75%</span>
                    </div>
                    <Progress value={subject.percentage} />
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500">Lectures remaining: 12</span>
                      <span className="text-blue-600 font-medium hover:underline">View Details →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="leave" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Leave Application</CardTitle>
                <CardDescription>Request academic permission for upcoming absences</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm studentId={student.id} onSubmitSuccess={handleAddLeave} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Application History</CardTitle>
                <CardDescription>Track status of your submitted requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.length === 0 ? (
                    <p className="text-center py-8 text-sm text-gray-500">No leave requests found.</p>
                  ) : (
                    leaveRequests.map((request) => (
                      <div key={request.id} className="p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-sm text-gray-900">
                            {new Date(request.startDate).toLocaleDateString()} -{" "}
                            {new Date(request.endDate).toLocaleDateString()}
                          </span>
                          <Badge
                            className={
                              request.status === "approved"
                                ? "bg-green-600"
                                : request.status === "rejected"
                                  ? "bg-red-600"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {request.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{request.reason}</p>
                        <p className="text-[11px] text-gray-400">
                          Submitted on {new Date(request.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Hub Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Generate Reports</CardTitle>
              <CardDescription>Download instant reports for academic verification or personal records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col bg-transparent hover:bg-blue-50 border-blue-200"
                  onClick={() => handleReportClick("Monthly Attendance Summary")}
                >
                  <FileText className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="font-semibold text-sm">Monthly Report</span>
                  <span className="text-xs text-gray-500">Past 30 days</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col bg-transparent hover:bg-green-50 border-green-200"
                  onClick={() => handleReportClick("Semester 6 Cumulative Report")}
                >
                  <Calendar className="h-6 w-6 mb-2 text-green-600" />
                  <span className="font-semibold text-sm">Semester Report</span>
                  <span className="text-xs text-gray-500">Term-to-date</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col bg-transparent hover:bg-purple-50 border-purple-200"
                  onClick={() => handleReportClick("Subject-wise Performance Breakdown")}
                >
                  <BookOpen className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="font-semibold text-sm">Subject Breakdown</span>
                  <span className="text-xs text-gray-500">All courses</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col bg-transparent hover:bg-orange-50 border-orange-200"
                  onClick={handleAnalyticsClick}
                >
                  <TrendingUp className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="font-semibold text-sm">Performance Trends</span>
                  <span className="text-xs text-gray-500">Interactive charts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <DummyReports />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Subject Detail Modal */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-lg">{selectedSubjectModal.subjectName}</h3>
              </div>
              <button
                onClick={() => setSelectedSubjectModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-700">{selectedSubjectModal.percentage}%</div>
                  <div className="text-xs text-gray-600">Attendance</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">{selectedSubjectModal.present}</div>
                  <div className="text-xs text-gray-600">Attended</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-700">{selectedSubjectModal.total}</div>
                  <div className="text-xs text-gray-600">Total Classes</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Faculty In-Charge</h4>
                <p className="text-gray-600 text-xs">Dr. Sarah Wilson (Office: Room 402, CS Block)</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Eligibility Status</h4>
                <p className="text-xs text-gray-600">
                  {selectedSubjectModal.percentage >= 75
                    ? "✓ You have met the minimum 75% attendance requirement for final exam eligibility."
                    : "⚠ Your attendance is below 75%. Please contact your course coordinator."}
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    triggerDownload("csv")
                    setSelectedSubjectModal(null)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Subject Sheet
                </Button>
                <Button variant="outline" onClick={() => setSelectedSubjectModal(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">{reportModalData.title}</h3>
              </div>
              <button
                onClick={() => setReportModalData(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600">{reportModalData.description}</p>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
              <p>
                <strong>Student:</strong> {student.name} ({student.studentId || "CS2021001"})
              </p>
              <p>
                <strong>Total Classes:</strong> {attendanceStats.totalClasses} |{" "}
                <strong>Attended:</strong> {attendanceStats.attendedClasses}
              </p>
              <p>
                <strong>Attendance Rate:</strong> {attendanceStats.attendancePercentage}%
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  triggerDownload("csv")
                  setReportModalData(null)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report (.CSV)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.print()
                  setReportModalData(null)
                }}
              >
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
