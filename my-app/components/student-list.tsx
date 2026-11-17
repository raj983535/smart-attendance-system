"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Mail,
  Phone,
  Eye,
  TrendingUp,
  TrendingDown,
  Download,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react"
import { getAttendanceColor } from "@/lib/attendance-utils"
import { mockStudents } from "@/lib/mock-data"
import type { Student, Subject } from "@/lib/types"

interface StudentListProps {
  students: Student[]
  subjects: Subject[]
  facultyId: string
}

export function StudentList({ students, subjects, facultyId }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [copiedNotice, setCopiedNotice] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  const displayStudents: Student[] = (students && students.length > 0 ? students : mockStudents).map(
    (student) => ({
      ...student,
      role: "student" as const,
    }),
  )

  const filteredStudents = displayStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const showNotice = (msg: string) => {
    setCopiedNotice(msg)
    setTimeout(() => setCopiedNotice(""), 3000)
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard?.writeText(email)
    showNotice(`Email copied to clipboard: ${email}`)
  }

  const handleCopyPhone = (studentName: string) => {
    const dummyPhone = "+91 98765 " + Math.floor(10000 + Math.random() * 90000)
    navigator.clipboard?.writeText(dummyPhone)
    showNotice(`Contact for ${studentName} copied: ${dummyPhone}`)
  }

  const handleExportCSV = () => {
    const csvContent =
      "Student ID,Name,Email,Department,Semester,Attendance %,Classes Attended,Total Classes\n" +
      filteredStudents
        .map((s) => {
          const stats = getStudentStats(s.id)
          return `"${s.studentId}","${s.name}","${s.email}","${s.department}",${s.semester},${stats.attendancePercentage}%,${stats.attendedClasses},${stats.totalClasses}`
        })
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `student_directory_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotice("Student roster CSV downloaded successfully!")
  }

  const getStudentStats = (studentId: string) => {
    // Deterministic stats per student based on id
    const hash = studentId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const attendancePercentage = 65 + (hash % 32) // 65% to 96%
    const totalClasses = 48
    const attendedClasses = Math.round((attendancePercentage / 100) * totalClasses)

    const subjectsList = subjects && subjects.length > 0 ? subjects : [
      { id: "1", name: "Data Structures & Algorithms" },
      { id: "2", name: "Database Management Systems" },
      { id: "3", name: "Machine Learning & AI" },
      { id: "4", name: "Computer Networks" },
      { id: "5", name: "Operating Systems" },
    ]

    return {
      attendancePercentage,
      totalClasses,
      attendedClasses,
      subjectWiseAttendance: subjectsList.map((subject, idx) => ({
        subjectId: subject.id,
        subjectName: subject.name,
        percentage: Math.min(100, Math.max(55, attendancePercentage - 6 + (idx * 5) % 15)),
      })),
    }
  }

  return (
    <div className="space-y-6">
      {/* Copied/Action Notice */}
      {copiedNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
          {copiedNotice}
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Student Directory & Profiles</CardTitle>
              <CardDescription>Search and inspect individual academic attendance</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportCSV}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Roster (.CSV)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, ID (e.g. CS2021001), or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id)
          return (
            <Card key={student.id} className="hover:shadow-md transition-all border-gray-200 hover:border-blue-300">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border border-gray-200">
                      <AvatarImage src={student.profileImage || "/default-profile.jpg"} alt={student.name} />
                      <AvatarFallback className="bg-blue-600 text-white font-medium">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{student.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{student.studentId}</p>
                      <p className="text-[11px] text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={stats.attendancePercentage >= 75 ? "default" : "destructive"}
                    className={
                      stats.attendancePercentage >= 75
                        ? "bg-green-600 text-xs"
                        : "bg-red-600 text-xs"
                    }
                  >
                    {stats.attendancePercentage}%
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Overall Attendance</span>
                    <span>{stats.attendedClasses} / {stats.totalClasses} classes</span>
                  </div>
                  <Progress value={stats.attendancePercentage} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  <div className="p-2 bg-green-50 rounded border border-green-100">
                    <div className="font-bold text-green-800">{stats.attendedClasses}</div>
                    <div className="text-[10px] text-green-700">Present</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded border border-red-100">
                    <div className="font-bold text-red-800">{stats.totalClasses - stats.attendedClasses}</div>
                    <div className="text-[10px] text-red-700">Absent</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => handleCopyEmail(student.email)}
                      title="Copy Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-gray-600 hover:text-green-600 hover:bg-green-50"
                      onClick={() => handleCopyPhone(student.name)}
                      title="Copy Phone Number"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1 text-blue-600" />
                    Profile & Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-gray-100 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 border border-gray-200">
                  <AvatarImage
                    src={selectedStudent.profileImage || "/default-profile.jpg"}
                    alt={selectedStudent.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedStudent.studentId} • {selectedStudent.department || "Computer Science"}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-800">Subject-wise Attendance Distribution</h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {getStudentStats(selectedStudent.id).subjectWiseAttendance.map((sub) => (
                  <div key={sub.subjectId} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-800">{sub.subjectName}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold ${getAttendanceColor(sub.percentage)}`}>
                        {sub.percentage}%
                      </span>
                      {sub.percentage >= 75 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  handleCopyEmail(selectedStudent.email)
                  setSelectedStudent(null)
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Student
              </Button>
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
