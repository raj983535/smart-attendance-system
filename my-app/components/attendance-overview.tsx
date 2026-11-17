"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { mockSubjects } from "@/lib/mock-data"
import type { Subject, Student } from "@/lib/types"

interface AttendanceOverviewProps {
  facultyId: string
  subjects: Subject[]
  students: Student[]
}

export function AttendanceOverview({ facultyId, subjects, students }: AttendanceOverviewProps) {
  const activeSubjects = subjects && subjects.length > 0 ? subjects : mockSubjects

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", attendance: 85 },
    { day: "Tue", attendance: 92 },
    { day: "Wed", attendance: 78 },
    { day: "Thu", attendance: 88 },
    { day: "Fri", attendance: 95 },
  ]

  const subjectData = activeSubjects.map((subject) => ({
    name: subject.name.split(" ").slice(0, 2).join(" "),
    attendance: Math.floor(Math.random() * 20) + 75, // 75-95%
    students: Math.floor(Math.random() * 15) + 35, // 35-50 students
  }))

  const monthlyTrend = [
    { month: "Jan", attendance: 82 },
    { month: "Feb", attendance: 85 },
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 86 },
    { month: "May", attendance: 90 },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-green-600">+2.5% from last month</p>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-red-600">Below 75% attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>This week's daily attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: "#16a34a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Attendance rates by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                  <Bar dataKey="attendance" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
          <CardDescription>Detailed breakdown of each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSubjects.map((subject) => {
              const attendance = Math.floor(Math.random() * 30) + 70
              const enrolled = Math.floor(Math.random() * 20) + 30

              return (
                <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.code} • {enrolled} students enrolled
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{attendance}%</div>
                      <Progress value={attendance} className="w-20" />
                    </div>
                    <Badge variant={attendance >= 85 ? "default" : attendance >= 75 ? "secondary" : "destructive"}>
                      {attendance >= 85 ? "Excellent" : attendance >= 75 ? "Good" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Trend</CardTitle>
          <CardDescription>Overall attendance trend over the past 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
