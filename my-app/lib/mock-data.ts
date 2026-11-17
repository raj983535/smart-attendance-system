import type { Student, Faculty, Subject, AttendanceRecord, LeaveRequest } from "./types"

export const mockStudents: Student[] = [
  {
    id: "student-1",
    email: "sahil.kumar@college.edu",
    name: "Sahil Kumar",
    role: "student",
    studentId: "CS2021001",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-2",
    email: "sujit.sharma@college.edu",
    name: "Sujit Sharma",
    role: "student",
    studentId: "CS2021002",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-3",
    email: "manu.gupta@college.edu",
    name: "Manu Gupta",
    role: "student",
    studentId: "CS2021003",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-4",
    email: "raj.patel@college.edu",
    name: "Raj Patel",
    role: "student",
    studentId: "CS2021004",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-5",
    email: "sukla.singh@college.edu",
    name: "Sukla Singh",
    role: "student",
    studentId: "CS2021005",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-6",
    email: "adarsh.verma@college.edu",
    name: "Adarsh Verma",
    role: "student",
    studentId: "CS2021006",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-7",
    email: "priya.mehta@college.edu",
    name: "Priya Mehta",
    role: "student",
    studentId: "CS2021007",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-8",
    email: "rohit.jain@college.edu",
    name: "Rohit Jain",
    role: "student",
    studentId: "CS2021008",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-9",
    email: "neha.agarwal@college.edu",
    name: "Neha Agarwal",
    role: "student",
    studentId: "CS2021009",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-10",
    email: "vikash.yadav@college.edu",
    name: "Vikash Yadav",
    role: "student",
    studentId: "CS2021010",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-11",
    email: "ankit.mishra@college.edu",
    name: "Ankit Mishra",
    role: "student",
    studentId: "CS2021011",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
  {
    id: "student-12",
    email: "pooja.tiwari@college.edu",
    name: "Pooja Tiwari",
    role: "student",
    studentId: "CS2021012",
    department: "Computer Science",
    semester: 6,
    batch: "2021-2025",
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2021-08-01"),
  },
]

export const mockFaculty: Faculty[] = [
  {
    id: "faculty-1",
    email: "dr.wilson@university.edu",
    name: "Dr. Sarah Wilson",
    role: "faculty",
    facultyId: "FAC001",
    department: "Computer Science",
    subjects: ["Data Structures and Algorithms", "Database Management Systems", "Web Development"],
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2020-01-01"),
  },
  {
    id: "faculty-2",
    email: "prof.johnson@university.edu",
    name: "Prof. Michael Johnson",
    role: "faculty",
    facultyId: "FAC002",
    department: "Computer Science",
    subjects: ["Machine Learning & AI", "Computer Networks", "Operating Systems"],
    profileImage: "/default-profile.jpg",
    createdAt: new Date("2019-08-01"),
  },
]

export const mockSubjects: Subject[] = [
  {
    id: "subject-1",
    name: "Data Structures & Algorithms",
    code: "CS301",
    department: "Computer Science",
    facultyId: "faculty-1",
    semester: 6,
    credits: 4,
  },
  {
    id: "subject-2",
    name: "Database Management Systems",
    code: "CS302",
    department: "Computer Science",
    facultyId: "faculty-1",
    semester: 6,
    credits: 3,
  },
  {
    id: "subject-3",
    name: "Machine Learning & AI",
    code: "CS401",
    department: "Computer Science",
    facultyId: "faculty-2",
    semester: 6,
    credits: 4,
  },
  {
    id: "subject-4",
    name: "Computer Networks",
    code: "CS304",
    department: "Computer Science",
    facultyId: "faculty-2",
    semester: 6,
    credits: 3,
  },
  {
    id: "subject-5",
    name: "Operating Systems",
    code: "CS305",
    department: "Computer Science",
    facultyId: "faculty-2",
    semester: 6,
    credits: 4,
  },
  {
    id: "subject-6",
    name: "Web Development Technologies",
    code: "CS306",
    department: "Computer Science",
    facultyId: "faculty-1",
    semester: 6,
    credits: 3,
  },
]

// Generate rich mock attendance records spanning multiple dates
export function generateMockAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const today = new Date()

  // Generate for past 20 class sessions
  for (let dayOffset = 0; dayOffset < 20; dayOffset++) {
    const sessionDate = new Date(today)
    sessionDate.setDate(today.getDate() - dayOffset)
    if (sessionDate.getDay() === 0 || sessionDate.getDay() === 6) continue // skip weekends

    mockSubjects.forEach((subject, subIdx) => {
      // Pick class hour
      const sessionTime = new Date(sessionDate)
      sessionTime.setHours(9 + subIdx * 2, 0, 0, 0)

      mockStudents.forEach((student, stuIdx) => {
        // Pseudo-random deterministic status
        const rand = (dayOffset * 13 + subIdx * 7 + stuIdx * 11) % 100
        let status: "present" | "absent" | "late" = "present"
        if (rand < 12) status = "absent"
        else if (rand < 22) status = "late"

        records.push({
          id: `att-${dayOffset}-${subject.id}-${student.id}`,
          studentId: student.id,
          subjectId: subject.id,
          facultyId: subject.facultyId,
          date: sessionDate,
          status,
          timestamp: sessionTime,
          faceRecognitionConfidence: status === "present" ? 0.88 + (rand % 10) * 0.01 : undefined,
        })
      })
    })
  }

  return records
}

export const mockAttendanceRecords: AttendanceRecord[] = generateMockAttendanceRecords()

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    studentId: "student-1",
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 4),
    reason: "Attending National Level Hackathon at IIT Delhi",
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "leave-2",
    studentId: "student-2",
    startDate: new Date(Date.now() + 86400000 * 1),
    endDate: new Date(Date.now() + 86400000 * 2),
    reason: "Medical consultation & fever recovery",
    status: "pending",
    submittedAt: new Date(Date.now() - 43200000),
  },
  {
    id: "leave-3",
    studentId: "student-4",
    startDate: new Date(Date.now() - 86400000 * 5),
    endDate: new Date(Date.now() - 86400000 * 3),
    reason: "Family wedding event in hometown",
    status: "approved",
    submittedAt: new Date(Date.now() - 86400000 * 7),
    reviewedBy: "Dr. Sarah Wilson",
    reviewedAt: new Date(Date.now() - 86400000 * 6),
  },
  {
    id: "leave-4",
    studentId: "student-7",
    startDate: new Date(Date.now() - 86400000 * 10),
    endDate: new Date(Date.now() - 86400000 * 9),
    reason: "Sports tournament representation (University Badminton)",
    status: "approved",
    submittedAt: new Date(Date.now() - 86400000 * 12),
    reviewedBy: "Prof. Michael Johnson",
    reviewedAt: new Date(Date.now() - 86400000 * 11),
  },
  {
    id: "leave-5",
    studentId: "student-10",
    startDate: new Date(Date.now() - 86400000 * 2),
    endDate: new Date(Date.now() - 86400000 * 1),
    reason: "Unspecified personal leave without prior intimation",
    status: "rejected",
    submittedAt: new Date(Date.now() - 86400000 * 3),
    reviewedBy: "Dr. Sarah Wilson",
    reviewedAt: new Date(Date.now() - 86400000 * 2),
  },
]
