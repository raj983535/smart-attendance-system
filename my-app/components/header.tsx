"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GraduationCap,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  ArrowLeft,
  FileBarChart,
  LayoutDashboard,
  CheckCircle2,
  Bell,
  Moon,
  Shield,
  X,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [statusMsg, setStatusMsg] = useState("")

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-600"
      case "faculty":
        return "bg-green-600"
      case "admin":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const handleLogout = () => {
    logout()
  }

  const triggerSaveNotification = (msg: string) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(""), 2500)
  }

  return (
    <>
      <header className="border-b bg-white shadow-sm sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${getRoleColor(user.role)} shadow-sm`}>
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Smart Attendance</h1>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">v1.0</span>
              </div>
              <p className="text-xs text-gray-500 capitalize">{user.role} Control Center</p>
            </div>

            {/* Quick Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-gray-200">
              <Link href="/">
                <Button
                  variant={pathname === "/" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-1.5 text-xs font-medium"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button
                  variant={pathname === "/reports" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-1.5 text-xs font-medium"
                >
                  <FileBarChart className="h-3.5 w-3.5" />
                  <span>Reports Hub</span>
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Direct Switch Role / Back to Login button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Switch User</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all p-0">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.profileImage || "/default-profile.jpg"} alt={user.name} />
                    <AvatarFallback className={`${getRoleColor(user.role)} text-white font-medium`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 shadow-lg border-gray-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gray-50/70 border-b">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="pt-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <div className="p-1">
                  <DropdownMenuItem
                    className="cursor-pointer py-2"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <UserIcon className="mr-2 h-4 w-4 text-blue-600" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer py-2"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer py-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-white text-blue-700 font-bold text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-blue-100 text-sm">{user.email}</p>
                  <span className="inline-block mt-1 text-xs bg-white/20 text-white font-medium px-2 py-0.5 rounded-full capitalize">
                    {user.role} Account
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">Department</span>
                  <p className="font-semibold text-gray-800">{user.department || "Computer Science"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">ID Number</span>
                  <p className="font-semibold text-gray-800">
                    {user.studentId || user.employeeId || "CS2021001"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">Status</span>
                  <p className="font-semibold text-green-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                    Active
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">Semester / Batch</span>
                  <p className="font-semibold text-gray-800">Sem 6 (2021-25)</p>
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowProfileModal(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">System Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 text-sm">
              {statusMsg && (
                <div className="p-2.5 bg-green-50 text-green-700 rounded-lg flex items-center text-xs font-medium border border-green-200">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  {statusMsg}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Attendance Notifications</p>
                    <p className="text-xs text-gray-500">Receive alert when classes are logged</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => {
                      setNotificationsEnabled(e.target.checked)
                      triggerSaveNotification("Notification preference updated!")
                    }}
                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Digest</p>
                    <p className="text-xs text-gray-500">Weekly report summary via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => {
                      setEmailAlerts(e.target.checked)
                      triggerSaveNotification("Email digest settings saved!")
                    }}
                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-900">
                    Security Level: Two-factor biometric verification enabled for faculty accounts.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-gray-900 hover:bg-black text-white"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Close Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
