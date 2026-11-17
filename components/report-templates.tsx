"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  BookOpen,
  Download,
} from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "attendance" | "analytics" | "compliance" | "performance"
  frequency: "daily" | "weekly" | "monthly" | "on-demand"
  features: string[]
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "daily-attendance",
    name: "Daily Attendance Summary",
    description: "Complete attendance overview for a specific day with present/absent breakdown",
    icon: Calendar,
    category: "attendance",
    frequency: "daily",
    features: ["Student list", "Attendance status", "Late arrivals", "Subject-wise breakdown"],
  },
  {
    id: "weekly-trends",
    name: "Weekly Attendance Trends",
    description: "Analyze attendance patterns and trends over a week with visual charts",
    icon: TrendingUp,
    category: "analytics",
    frequency: "weekly",
    features: ["Trend analysis", "Charts & graphs", "Comparison data", "Insights"],
  },
  {
    id: "student-performance",
    name: "Student Performance Report",
    description: "Individual student attendance performance with detailed analytics",
    icon: Users,
    category: "performance",
    frequency: "on-demand",
    features: ["Individual metrics", "Subject breakdown", "Improvement suggestions", "Parent communication"],
  },
  {
    id: "low-attendance-alert",
    name: "Low Attendance Alert",
    description: "Identify students with attendance below threshold for early intervention",
    icon: AlertTriangle,
    category: "compliance",
    frequency: "weekly",
    features: ["At-risk students", "Threshold analysis", "Action recommendations", "Contact details"],
  },
  {
    id: "subject-analytics",
    name: "Subject-wise Analytics",
    description: "Comprehensive analysis of attendance patterns by subject",
    icon: BookOpen,
    category: "analytics",
    frequency: "monthly",
    features: ["Subject comparison", "Peak attendance times", "Seasonal trends", "Faculty insights"],
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary Report",
    description: "Complete monthly attendance overview with statistics and insights",
    icon: BarChart3,
    category: "attendance",
    frequency: "monthly",
    features: ["Monthly statistics", "Comparative analysis", "Trend identification", "Executive summary"],
  },
  {
    id: "late-arrival-tracking",
    name: "Late Arrival Tracking",
    description: "Track and analyze late arrival patterns to improve punctuality",
    icon: Clock,
    category: "compliance",
    frequency: "weekly",
    features: ["Late arrival logs", "Pattern analysis", "Time-based insights", "Intervention strategies"],
  },
  {
    id: "semester-overview",
    name: "Semester Overview",
    description: "Comprehensive semester-end attendance report with complete analytics",
    icon: FileText,
    category: "performance",
    frequency: "on-demand",
    features: ["Semester statistics", "Grade correlation", "Achievement analysis", "Recommendations"],
  },
]

interface ReportTemplatesProps {
  onSelectTemplate: (template: ReportTemplate) => void
}

export function ReportTemplates({ onSelectTemplate }: ReportTemplatesProps) {
  const getCategoryColor = (category: ReportTemplate["category"]) => {
    switch (category) {
      case "attendance":
        return "bg-blue-100 text-blue-800"
      case "analytics":
        return "bg-green-100 text-green-800"
      case "compliance":
        return "bg-orange-100 text-orange-800"
      case "performance":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFrequencyColor = (frequency: ReportTemplate["frequency"]) => {
    switch (frequency) {
      case "daily":
        return "bg-red-100 text-red-800"
      case "weekly":
        return "bg-yellow-100 text-yellow-800"
      case "monthly":
        return "bg-blue-100 text-blue-800"
      case "on-demand":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Templates</h2>
        <p className="text-gray-600">Choose from pre-configured report templates or create custom reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((template) => {
          const IconComponent = template.icon

          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="secondary" className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className={getFrequencyColor(template.frequency)}>
                    {template.frequency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{template.description}</CardDescription>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features included:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full mt-4" onClick={() => onSelectTemplate(template)}>
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Custom Report Option */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Create Custom Report</h3>
              <p className="text-gray-600 mt-1">Build a custom report with your specific requirements and filters</p>
            </div>
            <Button
              variant="outline"
              className="bg-transparent hover:bg-blue-50"
              onClick={() => onSelectTemplate(reportTemplates[0])}
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
