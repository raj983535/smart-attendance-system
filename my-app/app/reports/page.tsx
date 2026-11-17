"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { ReportGenerator } from "@/components/report-generator"
import { ReportTemplates } from "@/components/report-templates"
import { ReportHistory } from "@/components/report-history"
import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"

export default function ReportsPage() {
  const { user, isAuthenticated, login, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("generator")

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
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator">Report Generator</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
              <ReportGenerator user={user!} />
            </TabsContent>

            <TabsContent value="templates">
              <ReportTemplates
                onSelectTemplate={(template) => {
                  console.log("Selected template:", template)
                  setActiveTab("generator")
                }}
              />
            </TabsContent>

            <TabsContent value="history">
              <ReportHistory />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
