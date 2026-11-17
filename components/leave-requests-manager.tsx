"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Calendar, CheckCheck, User } from "lucide-react"
import { mockLeaveRequests, mockStudents } from "@/lib/mock-data"
import type { LeaveRequest, Student } from "@/lib/types"

interface LeaveRequestsManagerProps {
  facultyId: string
}

export function LeaveRequestsManager({ facultyId }: LeaveRequestsManagerProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [actionNotice, setActionNotice] = useState<string>("")

  const showNotice = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(""), 3000)
  }

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "approved" as const, reviewedBy: facultyId || "Faculty", reviewedAt: new Date() }
          : req,
      ),
    )
    showNotice("Leave request approved successfully.")
  }

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "rejected" as const, reviewedBy: facultyId || "Faculty", reviewedAt: new Date() }
          : req,
      ),
    )
    showNotice("Leave request marked as rejected.")
  }

  const handleApproveAll = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.status === "pending"
          ? { ...req, status: "approved" as const, reviewedBy: facultyId || "Faculty", reviewedAt: new Date() }
          : req,
      ),
    )
    showNotice("All pending requests approved in batch.")
  }

  const getStudent = (studentId: string): Student => {
    const found = mockStudents.find((s) => s.id === studentId || s.studentId === studentId)
    if (found) return found

    // Fallback pseudo-student
    return {
      id: studentId,
      name: `Student (${studentId})`,
      studentId: studentId.toUpperCase(),
      email: `${studentId}@college.edu`,
      role: "student",
      department: "Computer Science",
      semester: 6,
      batch: "2021-25",
      profileImage: "/default-profile.jpg",
    }
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const reviewedRequests = requests.filter((req) => req.status !== "pending")

  const LeaveRequestCard = ({ request }: { request: LeaveRequest }) => {
    const student = getStudent(request.studentId)

    return (
      <Card className="hover:border-blue-200 transition-colors">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={student.profileImage || "/default-profile.jpg"} alt={student.name} />
                <AvatarFallback className="bg-blue-600 text-white font-medium">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                  <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {student.studentId}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Submitted {new Date(request.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="font-medium text-gray-900">Reason: </span>
                  {request.reason}
                </p>
                {request.reviewedBy && (
                  <p className="text-xs text-gray-500 pt-1">
                    Reviewed on {new Date(request.reviewedAt || Date.now()).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-start">
              <Badge
                variant={
                  request.status === "approved"
                    ? "default"
                    : request.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  request.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : request.status === "rejected"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-orange-100 text-orange-800"
                }
              >
                {request.status.toUpperCase()}
              </Badge>
              {request.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(request.id)}
                    className="text-green-600 border-green-600 hover:bg-green-50 h-8"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50 h-8"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {actionNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center font-medium animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {actionNotice}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leave Request Management</CardTitle>
            <CardDescription>Review and sanction official student leave applications</CardDescription>
          </div>
          {pendingRequests.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleApproveAll}
              className="text-green-700 border-green-600 hover:bg-green-50 text-xs"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
              Approve All Pending ({pendingRequests.length})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-700">{pendingRequests.length}</div>
              <div className="text-sm text-orange-600 font-medium">Pending Approvals</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-700">
                {reviewedRequests.filter((r) => r.status === "approved").length}
              </div>
              <div className="text-sm text-green-600 font-medium">Approved Leaves</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-700">
                {reviewedRequests.filter((r) => r.status === "rejected").length}
              </div>
              <div className="text-sm text-red-600 font-medium">Rejected Leaves</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <h3 className="text-base font-medium text-gray-700">No pending leave requests</h3>
                <p className="text-sm text-muted-foreground">All student applications are up to date.</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => <LeaveRequestCard key={request.id} request={request} />)
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedRequests.map((request) => (
            <LeaveRequestCard key={request.id} request={request} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
