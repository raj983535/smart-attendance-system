import type { User, UserRole } from "./types"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string, role: UserRole) => Promise<User | null>
}

// Mock authentication - in production, this would connect to your auth provider
export const mockAuth = {
  login: async (email: string, password: string, role: UserRole): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = existingUsers.find((u: User) => u.email === email && u.role === role)

    if (user) {
      return user
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name: email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      role: role,
      avatar: `/placeholder.svg?height=40&width=40&query=${role}+avatar`,
      department: role === "student" ? "General Studies" : "General Faculty",
      studentId: role === "student" ? `STU${Date.now().toString().slice(-6)}` : undefined,
      employeeId: role !== "student" ? `EMP${Date.now().toString().slice(-6)}` : undefined,
    }

    existingUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

    return newUser
  },

  signup: async (email: string, password: string, role: UserRole): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userExists = existingUsers.find((u: User) => u.email === email && u.role === role)

    if (userExists) {
      return userExists
    }

    // Create new user based on role
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name: email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      role: role,
      avatar: `/placeholder.svg?height=40&width=40&query=${role}+avatar`,
      department: role === "student" ? "General Studies" : "General Faculty",
      studentId: role === "student" ? `STU${Date.now().toString().slice(-6)}` : undefined,
      employeeId: role !== "student" ? `EMP${Date.now().toString().slice(-6)}` : undefined,
    }

    existingUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

    return newUser
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === "undefined") return

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  },
}
