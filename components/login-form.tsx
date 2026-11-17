"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, User, Users } from "lucide-react"
import { mockAuth } from "@/lib/auth"
import type { User as UserType, UserRole } from "@/lib/types"

interface LoginFormProps {
  onLogin: (user: UserType) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!password || password.length < 3) {
      setError("Password must be at least 3 characters long")
      setIsLoading(false)
      return
    }

    try {
      if (isLogin) {
        const user = await mockAuth.login(email, password, selectedRole)
        if (user) {
          mockAuth.setCurrentUser(user)
          onLogin(user)
        } else {
          setError("Login failed. Please try again.")
        }
      } else {
        const user = await mockAuth.signup(email, password, selectedRole)
        if (user) {
          mockAuth.setCurrentUser(user)
          onLogin(user)
        } else {
          setError("Signup failed. Please try again.")
        }
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    { value: "student" as UserRole, label: "Student", icon: User, color: "bg-blue-600" },
    { value: "faculty" as UserRole, label: "Faculty", icon: Users, color: "bg-green-600" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Attendance System</CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin ? "Sign in to access your dashboard" : "Create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedRole === role.value
                          ? `${role.color} text-white border-transparent`
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={isLoading}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{role.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
