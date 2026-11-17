"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  CameraOff,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Settings,
  Scan,
  MonitorPlay,
  CheckCheck,
  X,
} from "lucide-react"
import { mockStudents } from "@/lib/mock-data"
import { CameraSettings as CameraSettingsComponent } from "@/components/camera-settings"
import type { Subject } from "@/lib/types"

const engineeringSubjects = [
  { id: "math101", name: "Data Structures & Algorithms", code: "CS301" },
  { id: "phy101", name: "Database Management Systems", code: "CS302" },
  { id: "chem101", name: "Machine Learning & AI", code: "CS401" },
  { id: "cs101", name: "Computer Networks", code: "CS304" },
  { id: "ds201", name: "Operating Systems", code: "CS305" },
  { id: "algo301", name: "Web Development Technologies", code: "CS306" },
]

interface CameraAttendanceProps {
  facultyId: string
  subjects: Subject[]
}

interface DetectedStudent {
  id: string
  name: string
  studentId: string
  confidence: number
  status: "detected" | "confirmed" | "marked"
}

export function CameraAttendance({ facultyId, subjects }: CameraAttendanceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSimulatedCamera, setIsSimulatedCamera] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("math101")
  const [isScanning, setIsScanning] = useState(false)
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([])
  const [attendanceMarked, setAttendanceMarked] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [scanProgress, setScanProgress] = useState(0)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Start real camera stream
  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        setIsSimulatedCamera(false)
      }
    } catch (err) {
      // Automatic fallback to simulated feed if hardware camera isn't available
      setError("Webcam hardware not detected. Starting simulated AI camera feed for demonstration.")
      startSimulatedFeed()
    }
  }

  // Start simulated camera feed
  const startSimulatedFeed = () => {
    setError("")
    setIsStreaming(true)
    setIsSimulatedCamera(true)
  }

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    setIsSimulatedCamera(false)
    setIsScanning(false)
  }

  // Simulate face detection and recognition
  const startFaceDetection = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first.")
      return
    }

    setIsScanning(true)
    setDetectedStudents([])
    setScanProgress(0)
    setError("")
    setSuccessMessage("")

    // Simulate scanning progress
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += 20
      setScanProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
      }
    }, 250)

    // Simulate face detection after 1.4 seconds
    setTimeout(() => {
      // Pick 3-5 students randomly
      const shuffled = [...mockStudents].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3)

      const detectedList: DetectedStudent[] = selected.map((student) => ({
        id: student.id,
        name: student.name,
        studentId: student.studentId,
        confidence: Math.round((Math.random() * 0.18 + 0.82) * 100) / 100, // 82% to 100%
        status: "detected",
      }))

      setDetectedStudents(detectedList)
      setIsScanning(false)
      setScanProgress(0)
    }, 1400)
  }

  // Confirm single student
  const confirmStudent = (studentId: string) => {
    setDetectedStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, status: "confirmed" } : student)),
    )
  }

  // Confirm all detected students
  const confirmAllStudents = () => {
    setDetectedStudents((prev) =>
      prev.map((student) => ({ ...student, status: "confirmed" })),
    )
  }

  // Mark attendance for confirmed students
  const markAttendance = async () => {
    const confirmedStudents = detectedStudents.filter((s) => s.status === "confirmed")

    if (confirmedStudents.length === 0) {
      setError("Please confirm at least one student before marking attendance.")
      return
    }

    setError("")
    const markedIds = confirmedStudents.map((s) => s.id)
    setAttendanceMarked((prev) => [...prev, ...markedIds])

    setDetectedStudents((prev) =>
      prev.map((student) =>
        confirmedStudents.some((c) => c.id === student.id) ? { ...student, status: "marked" } : student,
      ),
    )

    setSuccessMessage(
      `Attendance verified and recorded for ${confirmedStudents.length} student(s) in selected lecture!`,
    )
    setTimeout(() => setSuccessMessage(""), 4500)
  }

  // Reset detection
  const resetDetection = () => {
    setDetectedStudents([])
    setAttendanceMarked([])
    setScanProgress(0)
    setError("")
    setSuccessMessage("")
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const confirmedCount = detectedStudents.filter((s) => s.status === "confirmed").length
  const activeSubjectObj =
    engineeringSubjects.find((s) => s.id === selectedSubject) || engineeringSubjects[0]

  return (
    <div className="space-y-6">
      {/* Camera Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">AI Face Recognition Camera</h3>
          <p className="text-xs text-muted-foreground">
            Biometric verification module with automated facial bounding box detection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={resetDetection} disabled={!isStreaming}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Reset Scan
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Detection Config
          </Button>
        </div>
      </div>

      {/* Subject Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Select Lecture Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {engineeringSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900">
              <span className="font-semibold">Current Session: </span>
              {activeSubjectObj.name} • 60 min lecture slot
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {successMessage && (
        <Alert className="border-green-300 bg-green-50 text-green-900 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="font-medium text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="text-xs animate-in fade-in">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Camera Feed & Detection Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="py-3 px-4 bg-gray-50 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Camera className="h-4 w-4 text-blue-600" />
              <span>Camera Video Feed</span>
            </CardTitle>
            {isStreaming && (
              <Badge className="bg-green-600 text-[10px] uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                {isSimulatedCamera ? "Simulated Live Feed" : "Webcam Live"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[280px]">
              {/* Real Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-72 object-cover"
                style={{ display: isStreaming && !isSimulatedCamera ? "block" : "none" }}
              />

              {/* Simulated Camera Feed View */}
              {isStreaming && isSimulatedCamera && (
                <div className="w-full h-72 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  {/* Subtle Grid animation */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Face detection target boxes */}
                  <div className="absolute top-10 left-12 border-2 border-emerald-400 bg-emerald-500/10 rounded w-24 h-28 flex flex-col justify-between p-1">
                    <span className="text-[10px] bg-emerald-600 text-white font-mono px-1 rounded self-start">96% Face</span>
                    <span className="text-[9px] text-emerald-300 font-mono self-end">ID: CS001</span>
                  </div>

                  <div className="absolute bottom-8 right-14 border-2 border-blue-400 bg-blue-500/10 rounded w-24 h-28 flex flex-col justify-between p-1">
                    <span className="text-[10px] bg-blue-600 text-white font-mono px-1 rounded self-start">92% Face</span>
                    <span className="text-[9px] text-blue-300 font-mono self-end">ID: CS002</span>
                  </div>

                  <Users className="h-14 w-14 text-blue-400/80 mb-2" />
                  <p className="text-white text-sm font-semibold">Simulated Camera AI Sensor Active</p>
                  <p className="text-xs text-blue-200 mt-1 max-w-xs">
                    Classroom video stream running. Click "Scan Faces" to capture biometric signatures.
                  </p>
                </div>
              )}

              {/* Inactive Camera State */}
              {!isStreaming && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <CameraOff className="h-12 w-12 text-gray-500 mb-3" />
                  <p className="text-sm font-medium text-gray-200 mb-1">Camera Feed is Offline</p>
                  <p className="text-xs text-gray-400 max-w-xs mb-4">
                    Activate camera or run the simulated camera scanner to record student marks.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button size="sm" onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="h-4 w-4 mr-1.5" />
                      Start Camera
                    </Button>
                    <Button size="sm" variant="secondary" onClick={startSimulatedFeed}>
                      <MonitorPlay className="h-4 w-4 mr-1.5" />
                      Run Demo Stream
                    </Button>
                  </div>
                </div>
              )}

              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white p-5 rounded-xl shadow-xl text-center max-w-xs w-full">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">Scanning & Matching Faces...</p>
                    <p className="text-xs text-gray-500 mt-1">Comparing 128 biometric landmark points</p>
                    <Progress value={scanProgress} className="w-full mt-3 h-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Feed Action Bar */}
            {isStreaming && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={startFaceDetection}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700 font-medium"
                >
                  <Scan className="h-4 w-4 mr-1.5" />
                  {isScanning ? "Scanning..." : "Scan Faces"}
                </Button>
                <Button size="sm" variant="outline" onClick={stopCamera}>
                  <CameraOff className="h-4 w-4 mr-1.5" />
                  Stop Camera
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detected Students Roster */}
        <Card className="flex flex-col">
          <CardHeader className="py-3 px-4 bg-gray-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Detected Students ({detectedStudents.length})</span>
              </CardTitle>
            </div>
            {detectedStudents.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={confirmAllStudents}
                className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Confirm All
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            {detectedStudents.length === 0 && !isScanning ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <Users className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">No students scanned yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Start camera feed and click "Scan Faces" to detect faces in frame.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {detectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 border rounded-lg transition-all flex items-center justify-between ${
                      student.status === "marked"
                        ? "bg-green-50 border-green-200"
                        : student.status === "confirmed"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-gray-900">{student.name}</span>
                        <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border text-gray-600">
                          {student.studentId}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Confidence: <strong className="text-blue-700">{Math.round(student.confidence * 100)}%</strong>
                        </span>
                        <span className="text-[10px] text-gray-400">• Face Matched</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {student.status === "detected" && (
                        <Button
                          size="sm"
                          onClick={() => confirmStudent(student.id)}
                          className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Confirm
                        </Button>
                      )}
                      {student.status === "confirmed" && (
                        <Badge className="bg-blue-600 text-xs py-1">
                          Confirmed ✓
                        </Badge>
                      )}
                      {student.status === "marked" && (
                        <Badge className="bg-green-600 text-xs py-1">
                          Recorded ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detectedStudents.length > 0 && (
              <div className="pt-4 border-t mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {confirmedCount} of {detectedStudents.length} verified
                </span>
                <Button
                  onClick={markAttendance}
                  disabled={confirmedCount === 0}
                  className="bg-green-600 hover:bg-green-700 font-semibold"
                >
                  <CheckCheck className="h-4 w-4 mr-1.5" />
                  Save Verified Attendance ({confirmedCount})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Camera Settings Dialog Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-700" />
                <h3 className="font-bold text-gray-900 text-base">Face Detection Parameters</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CameraSettingsComponent
              onSettingsChange={(newSettings) => {
                console.log("Updated camera settings:", newSettings)
              }}
            />

            <div className="pt-2">
              <Button className="w-full" onClick={() => setShowSettingsModal(false)}>
                Done & Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
