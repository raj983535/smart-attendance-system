"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SubjectAttendanceData {
  subjectId: string
  subjectName: string
  percentage: number
  present: number
  total: number
}

interface SubjectAttendanceChartProps {
  data: SubjectAttendanceData[]
}

export function SubjectAttendanceChart({ data }: SubjectAttendanceChartProps) {
  const chartData = data.map((item) => ({
    subject: item.subjectName.split(" ").slice(0, 2).join(" "), // Shorten names
    percentage: item.percentage,
    present: item.present,
    total: item.total,
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            formatter={(value, name) => [
              name === "percentage" ? `${value}%` : value,
              name === "percentage" ? "Attendance" : name,
            ]}
            labelStyle={{ color: "#374151" }}
          />
          <Bar dataKey="percentage" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
