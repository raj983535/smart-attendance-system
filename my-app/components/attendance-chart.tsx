"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AttendanceChartProps {
  studentId: string
}

export function AttendanceChart({ studentId }: AttendanceChartProps) {
  // Generate mock data for the last 30 days
  const generateChartData = () => {
    const data = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Mock attendance percentage for each day
      const attendance = Math.floor(Math.random() * 40) + 60 // 60-100%

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        attendance: attendance,
      })
    }

    return data
  }

  const data = generateChartData()

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} labelStyle={{ color: "#374151" }} />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
