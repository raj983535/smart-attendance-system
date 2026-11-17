export type UserRole = "student" | "faculty" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileImage?: string
  avatar?: string
  department?: string
  studentId?: string
  employeeId?: string
  createdAt?: Date
}

export interface Student extends User {
  role: "student"
  studentId: string
  department: string
  semester: number
  batch: string
}

export interface Faculty extends User {
  role: "faculty"
  facultyId: string
  department: string
  subjects: string[]
}

export interface Subject {
  id: string
  name: string
  code: string
  department: string
  facultyId: string
  semester: number
  credits: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  subjectId: string
  facultyId: string
  date: Date
  status: "present" | "absent" | "late"
  timestamp: Date
  faceRecognitionConfidence?: number
}

export interface LeaveRequest {
  id: string
  studentId: string
  startDate: Date
  endDate: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedBy?: string
  reviewedAt?: Date
}

export interface AttendanceStats {
  totalClasses: number
  attendedClasses: number
  attendancePercentage: number
  subjectWiseAttendance: {
    subjectId: string
    subjectName: string
    percentage: number
    present: number
    total: number
  }[]
}
