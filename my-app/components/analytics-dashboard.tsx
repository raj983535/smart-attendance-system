"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Mail,
  X,
  Send,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"
import { mockStudents } from "@/lib/mock-data"

const attendanceTrendData = [
  { month: "Jan", attendance: 85, target: 75 },
  { month: "Feb", attendance: 78, target: 75 },
  { month: "Mar", attendance: 92, target: 75 },
  { month: "Apr", attendance: 88, target: 75 },
  { month: "May", attendance: 95, target: 75 },
  { month: "Jun", attendance: 82, target: 75 },
]

const subjectPerformanceData = [
  { subject: "Data Structures & Algorithms", attendance: 92, students: 48 },
  { subject: "Database Management Systems", attendance: 88, students: 48 },
  { subject: "Machine Learning & AI", attendance: 85, students: 48 },
  { subject: "Computer Networks", attendance: 79, students: 48 },
  { subject: "Operating Systems", attendance: 84, students: 48 },
  { subject: "Web Development", attendance: 94, students: 48 },
]

const attendanceDistribution = [
  { name: "Excellent (90-100%)", value: 42, color: "#10b981" },
  { name: "Good (75-89%)", value: 38, color: "#3b82f6" },
  { name: "Average (65-74%)", value: 14, color: "#f59e0b" },
  { name: "At-Risk (<65%)", value: 6, color: "#ef4444" },
]

export function AnalyticsDashboard() {
  const [showAtRiskModal, setShowAtRiskModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [actionNotice, setActionNotice] = useState("")

  // Schedule modal form state
  const [scheduleEmail, setScheduleEmail] = useState("coordinator@college.edu")
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly")
  const [scheduleFormat, setScheduleFormat] = useState("pdf")

  const showToast = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(""), 3500)
  }

  // At-risk students list
  const atRiskStudents = [
    { name: "Manu Gupta", id: "CS2021003", email: "manu.gupta@college.edu", attendance: 68, missed: 15 },
    { name: "Adarsh Verma", id: "CS2021006", email: "adarsh.verma@college.edu", attendance: 64, missed: 17 },
    { name: "Vikash Yadav", id: "CS2021010", email: "vikash.yadav@college.edu", attendance: 71, missed: 14 },
  ]

  const handleDownloadAnalytics = () => {
    const csvContent =
      "Subject,Attendance Rate,Students Enrolled,Status\n" +
      subjectPerformanceData
        .map((s) => `"${s.subject}",${s.attendance}%,${s.students},"${s.attendance >= 75 ? "Normal" : "Alert"}"`)
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `analytics_summary_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast("Analytics summary CSV generated and downloaded!")
  }

  const handleSendWarning = (studentName: string) => {
    showToast(`Official attendance warning notice sent to ${studentName}.`)
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowScheduleModal(false)
    showToast(`Automated ${scheduleFrequency} report scheduled for delivery to ${scheduleEmail}!`)
  }

  return (
    <div className="space-y-6">
      {actionNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {actionNotice}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overall Department Rate
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">87.5%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+2.3% vs target</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Students Tracked
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">48</p>
                <div className="flex items-center mt-1">
                  <Users className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">Across 6 semester courses</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowAtRiskModal(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  At-Risk Students
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                  <span className="text-xs text-orange-600 font-medium">Click to view & alert</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Classes Held This Month
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">94</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-600">100% recorded</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Monthly Attendance Trend</span>
            </CardTitle>
            <CardDescription>Academic attendance curve vs target (75%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2.5} name="Attendance %" />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Target (75%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>Student Attendance Tiers</span>
            </CardTitle>
            <CardDescription>Performance distribution across current batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceDistribution.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject-wise Course Performance</CardTitle>
          <CardDescription>Average student attendance logged per curriculum course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subjectPerformanceData.map((subject, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900">{subject.subject}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground">{subject.students} students</span>
                    <Badge variant={subject.attendance >= 85 ? "default" : "secondary"}>
                      {subject.attendance}%
                    </Badge>
                  </div>
                </div>
                <Progress value={subject.attendance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analytics Action Center</CardTitle>
          <CardDescription>Export reports and manage academic alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-16 flex-col space-y-1.5 bg-blue-600 hover:bg-blue-700"
              onClick={handleDownloadAnalytics}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold text-xs">Generate Analytics CSV</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-1.5 border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
              onClick={() => setShowAtRiskModal(true)}
            >
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-xs">View 3 At-Risk Students</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-1.5 bg-transparent"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-xs">Schedule Recurring Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Students Modal */}
      {showAtRiskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-lg">At-Risk Students Roster</h3>
              </div>
              <button onClick={() => setShowAtRiskModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              The following students have fallen below the mandatory 75% attendance threshold.
            </p>

            <div className="space-y-3">
              {atRiskStudents.map((st) => (
                <div key={st.id} className="p-3 border rounded-lg bg-orange-50/50 border-orange-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{st.name}</h4>
                    <p className="text-xs text-gray-500">{st.id} • {st.missed} lectures missed</p>
                    <span className="inline-block mt-1 text-xs font-bold text-red-600">
                      Attendance: {st.attendance}%
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-orange-700 border-orange-300 hover:bg-orange-100 h-8"
                    onClick={() => handleSendWarning(st.name)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Send Warning
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-2 border-t">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  showToast("Warning notifications dispatched to all 3 at-risk students.")
                  setShowAtRiskModal(false)
                }}
              >
                Send Warnings to All
              </Button>
              <Button variant="outline" onClick={() => setShowAtRiskModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-lg">Schedule Recurring Report</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label>Recipient Email</Label>
                <Input
                  type="email"
                  required
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Delivery Frequency</Label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Digest (at 6:00 PM)</SelectItem>
                    <SelectItem value="weekly">Weekly Summary (Every Friday)</SelectItem>
                    <SelectItem value="monthly">Monthly Comprehensive (Last Day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Document Format</Label>
                <Select value={scheduleFormat} onValueChange={setScheduleFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV Data File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-2 border-t">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save & Activate Schedule
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
