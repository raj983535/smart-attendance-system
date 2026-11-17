"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface FaceDetectionOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>
  isDetecting: boolean
  detectedFaces: Array<{
    x: number
    y: number
    width: number
    height: number
    confidence: number
    studentId?: string
    studentName?: string
  }>
}

export function FaceDetectionOverlay({ videoRef, isDetecting, detectedFaces }: FaceDetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isDetecting) {
      // Draw scanning animation
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      const time = Date.now() / 1000
      const scanLine = (Math.sin(time * 2) + 1) * 0.5 * canvas.height

      ctx.beginPath()
      ctx.moveTo(0, scanLine)
      ctx.lineTo(canvas.width, scanLine)
      ctx.stroke()
    }

    // Draw face detection boxes
    detectedFaces.forEach((face) => {
      const { x, y, width, height, confidence, studentName } = face

      // Draw bounding box
      ctx.strokeStyle = confidence > 0.8 ? "#10b981" : "#f59e0b"
      ctx.lineWidth = 3
      ctx.setLineDash([])
      ctx.strokeRect(x, y, width, height)

      // Draw confidence and name label
      if (studentName) {
        const label = `${studentName} (${Math.round(confidence * 100)}%)`
        const labelWidth = ctx.measureText(label).width + 20
        const labelHeight = 30

        // Background
        ctx.fillStyle = confidence > 0.8 ? "#10b981" : "#f59e0b"
        ctx.fillRect(x, y - labelHeight, labelWidth, labelHeight)

        // Text
        ctx.fillStyle = "white"
        ctx.font = "14px sans-serif"
        ctx.fillText(label, x + 10, y - 10)
      }
    })
  }, [isDetecting, detectedFaces, videoRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
