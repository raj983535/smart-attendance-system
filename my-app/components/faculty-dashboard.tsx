"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
  X,
  Download,
  FileText,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { CameraAttendance } from "@/components/camera-attendance"
import { StudentList } from "@/components/student-list"
import { AttendanceOverview } from "@/components/attendance-overview"
import { LeaveRequestsManager } from "@/components/leave-requests-manager"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DummyReports } from "@/components/dummy-reports"
import { ManualAttendance } from "@/components/manual-attendance"
import { mockStudents, mockSubjects, mockAttendanceRecords, mockLeaveRequests } from "@/lib/mock-data"
import type { Faculty, Student, Subject, AttendanceRecord } from "@/lib/types"

export function FacultyDashboard() {
  const { user } = useAuth()
  const [facultySubjects, setFacultySubjects] = useState<Subject[]>([])
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([])
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [activeSection, setActiveSection] = useState<string>("attendance")
  const [showManualAttendance, setShowManualAttendance] = useState(false)

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleSubject, setScheduleSubject] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduleRoom, setScheduleRoom] = useState("Room 304, CS Wing")
  const [notification, setNotification] = useState("")

  const [activeReportModal, setActiveReportModal] = useState<{
    title: string
    type: string
    recordsCount: number
  } | null>(null)

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  useEffect(() => {
    if (user && user.role === "faculty") {
      const faculty = user as Faculty

      // Get subjects taught by this faculty, or fallback to all subjects
      const subjects = mockSubjects.filter((subject) => subject.facultyId === faculty.id)
      setFacultySubjects(subjects.length > 0 ? subjects : mockSubjects)

      // Get all students
      setEnrolledStudents(mockStudents)

      // Mock today's attendance records (10 present, 2 absent)
      const today = new Date()
      const sampleToday: AttendanceRecord[] = mockStudents.map((s, idx) => ({
        id: `att-today-${s.id}`,
        studentId: s.id,
        subjectId: mockSubjects[0].id,
        facultyId: faculty.id,
        date: today,
        status: idx < 10 ? "present" : "absent",
        timestamp: today,
        faceRecognitionConfidence: idx < 10 ? 0.94 : undefined,
      }))
      setTodayAttendance(sampleToday)

      // Count pending leave requests
      const pending = mockLeaveRequests.filter((req) => req.status === "pending").length
      setPendingLeaves(pending)
    }
  }, [user])

  if (showManualAttendance) {
    return <ManualAttendance onBack={() => setShowManualAttendance(false)} />
  }

  if (!user || user.role !== "faculty") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const faculty = user as Faculty
  const totalStudents = enrolledStudents.length || 12
  const presentToday = todayAttendance.filter((record) => record.status === "present").length || 10
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 83

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowScheduleModal(false)
    showToast(`Lecture scheduled successfully for ${scheduleSubject || "Computer Science"} on ${scheduleDate} at ${scheduleTime}!`)
  }

  const downloadFacultyReport = (title: string) => {
    const csvContent =
      "Student ID,Name,Subject,Attendance %,Status\n" +
      enrolledStudents
        .map((s, idx) => `"${s.studentId}","${s.name}","${facultySubjects[0]?.name || "Core CS"}",${80 + (idx % 15)}%,"${idx < 10 ? "Regular" : "At Risk"}"`)
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(`Report '${title}' downloaded successfully!`)
    setActiveReportModal(null)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {notification}
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 rounded-xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Welcome, {faculty.name}!</h1>
              <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Faculty Portal
              </span>
            </div>
            <p className="text-green-100 text-sm mt-1">
              ID: {faculty.facultyId || "FAC001"} • {faculty.department || "Computer Science"} • {facultySubjects.length} Active Courses Assigned
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Schedule Class
            </Button>
            <Button
              size="sm"
              className="bg-white text-green-900 hover:bg-green-50 font-semibold"
              onClick={() => setShowManualAttendance(true)}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Manual Sheet
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-600"
          onClick={() => setActiveSection("students")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Enrolled Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {facultySubjects.length} subjects</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Click to view roster →</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-600"
          onClick={() => setActiveSection("overview")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Today's Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceRate}%</div>
            <p className="text-xs text-green-700 font-medium">
              {presentToday} of {totalStudents} present today
            </p>
            <p className="text-xs text-muted-foreground mt-2">{totalStudents - presentToday} recorded absent</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-600"
          onClick={() => setActiveSection("overview")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{facultySubjects.length}</div>
            <p className="text-xs text-muted-foreground">Semester 6 curriculum</p>
            <p className="text-xs text-purple-600 font-medium mt-2">All course logs active</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500"
          onClick={() => setActiveSection("leaves")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Leaves</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingLeaves}</div>
            <p className="text-xs text-orange-600 font-medium">Require approval review</p>
            <p className="text-xs text-muted-foreground mt-2">Click to manage leaves →</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="attendance">Take Attendance</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students ({totalStudents})</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests ({pendingLeaves})</TabsTrigger>
          <TabsTrigger value="reports">Reports Hub</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <span>AI Face Recognition Attendance</span>
                  </CardTitle>
                  <CardDescription>
                    Live webcam or simulated scanner to automatically mark student attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CameraAttendance facultyId={faculty.id} subjects={facultySubjects} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Methods</CardTitle>
                  <CardDescription>Alternative logging tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start text-sm bg-transparent"
                    variant="outline"
                    onClick={() => setShowManualAttendance(true)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-blue-600" />
                    Open Manual Attendance Sheet
                  </Button>
                  <Button
                    className="w-full justify-start text-sm bg-transparent"
                    variant="outline"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4 text-green-600" />
                    Schedule Makeup Lecture
                  </Button>
                  <Button
                    className="w-full justify-start text-sm bg-transparent"
                    variant="outline"
                    onClick={() => setActiveSection("students")}
                  >
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    View Student Directory
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Overview</CardTitle>
                  <CardDescription>{new Date().toDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Present</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-800">{presentToday} Students</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-900">Absent</span>
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-bold text-red-800">{totalStudents - presentToday} Students</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t text-sm">
                      <span className="text-muted-foreground">Session Attendance Rate</span>
                      <Badge className="bg-emerald-600">{attendanceRate}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <AttendanceOverview facultyId={faculty.id} subjects={facultySubjects} students={enrolledStudents} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentList students={enrolledStudents} subjects={facultySubjects} facultyId={faculty.id} />
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <LeaveRequestsManager facultyId={faculty.id} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 hover:bg-blue-50/50"
              onClick={() => setActiveReportModal({ title: "Daily Attendance Summary", type: "Daily", recordsCount: 12 })}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Daily Attendance Report</span>
                </CardTitle>
                <CardDescription>Present/absent status for today's lectures</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Generate & Download
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-green-200 hover:bg-green-50/50"
              onClick={() => setActiveReportModal({ title: "Subject-wise Attendance Analysis", type: "Subject", recordsCount: 6 })}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Subject-wise Analysis</span>
                </CardTitle>
                <CardDescription>Detailed stats across your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Generate & Download
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 hover:bg-purple-50/50"
              onClick={() => setActiveReportModal({ title: "Student Roster Report", type: "Student", recordsCount: 12 })}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Student Roster Report</span>
                </CardTitle>
                <CardDescription>Complete student profiles and marks</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Generate & Download
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-orange-200 hover:bg-orange-50/50"
              onClick={() => setActiveSection("analytics")}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span>Analytics Dashboard</span>
                </CardTitle>
                <CardDescription>Visual attendance curves and charts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-xs">
                  Open Analytics →
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-red-200 hover:bg-red-50/50"
              onClick={() => setActiveReportModal({ title: "At-Risk & Low Attendance Roster", type: "Compliance", recordsCount: 3 })}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>At-Risk Students List</span>
                </CardTitle>
                <CardDescription>Students with attendance below 75%</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download At-Risk List
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-teal-200 hover:bg-teal-50/50"
              onClick={() => setActiveReportModal({ title: "Late Arrivals Log", type: "Late", recordsCount: 5 })}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span>Late Arrivals Log</span>
                </CardTitle>
                <CardDescription>Track timestamps of tardy students</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  View & Download Log
                </Button>
              </CardContent>
            </Card>
          </div>

          <DummyReports />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Schedule Class Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-900 text-lg">Schedule Class Lecture</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label>Course Subject</Label>
                <Select value={scheduleSubject || facultySubjects[0]?.id} onValueChange={setScheduleSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultySubjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Classroom / Lab</Label>
                <Input
                  value={scheduleRoom}
                  onChange={(e) => setScheduleRoom(e.target.value)}
                  placeholder="e.g. Lab 4, Block B"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save & Notify Students
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">{activeReportModal.title}</h3>
              </div>
              <button onClick={() => setActiveReportModal(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Ready to export attendance metrics for {activeReportModal.recordsCount} enrolled students. Generated for faculty review.
            </p>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
              <p><strong>Faculty:</strong> {faculty.name} ({faculty.facultyId || "FAC001"})</p>
              <p><strong>Department:</strong> {faculty.department || "Computer Science"}</p>
              <p><strong>Records:</strong> {enrolledStudents.length} Students tracked</p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => downloadFacultyReport(activeReportModal.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report (.CSV)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.print()
                  setActiveReportModal(null)
                }}
              >
                Print Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
