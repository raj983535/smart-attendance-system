"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/header"
import { StudentDashboard } from "@/components/student-dashboard"
import { FacultyDashboard } from "@/components/faculty-dashboard"

export default function HomePage() {
  const { user, isAuthenticated, login, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        {user?.role === "student" && <StudentDashboard />}
        {user?.role === "faculty" && <FacultyDashboard />}
        {user?.role === "admin" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}
