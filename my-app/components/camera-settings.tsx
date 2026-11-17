"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Camera, Zap, Shield } from "lucide-react"

interface CameraSettingsProps {
  onSettingsChange: (settings: CameraSettings) => void
}

export interface CameraSettings {
  confidenceThreshold: number
  autoConfirm: boolean
  multipleDetection: boolean
  resolution: string
  frameRate: number
}

export function CameraSettings({ onSettingsChange }: CameraSettingsProps) {
  const [settings, setSettings] = useState<CameraSettings>({
    confidenceThreshold: 80,
    autoConfirm: false,
    multipleDetection: true,
    resolution: "640x480",
    frameRate: 30,
  })

  const updateSetting = <K extends keyof CameraSettings>(key: K, value: CameraSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Camera Settings</span>
        </CardTitle>
        <CardDescription>Configure face detection and camera parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Detection Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Detection Settings</span>
          </h4>

          <div className="space-y-2">
            <Label>Confidence Threshold: {settings.confidenceThreshold}%</Label>
            <Slider
              value={[settings.confidenceThreshold]}
              onValueChange={([value]) => updateSetting("confidenceThreshold", value)}
              min={50}
              max={95}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Higher values require more accurate face matches</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-confirm high confidence matches</Label>
              <p className="text-xs text-muted-foreground">Automatically confirm faces above 90% confidence</p>
            </div>
            <Switch
              checked={settings.autoConfirm}
              onCheckedChange={(checked) => updateSetting("autoConfirm", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Multiple face detection</Label>
              <p className="text-xs text-muted-foreground">Detect multiple students in a single scan</p>
            </div>
            <Switch
              checked={settings.multipleDetection}
              onCheckedChange={(checked) => updateSetting("multipleDetection", checked)}
            />
          </div>
        </div>

        {/* Camera Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Camera Settings</span>
          </h4>

          <div className="space-y-2">
            <Label>Resolution</Label>
            <Select value={settings.resolution} onValueChange={(value) => updateSetting("resolution", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="320x240">320x240 (Low)</SelectItem>
                <SelectItem value="640x480">640x480 (Standard)</SelectItem>
                <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frame Rate: {settings.frameRate} FPS</Label>
            <Slider
              value={[settings.frameRate]}
              onValueChange={([value]) => updateSetting("frameRate", value)}
              min={15}
              max={60}
              step={15}
              className="w-full"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacy & Security</span>
          </h4>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Notice:</strong> Face detection is processed locally on your device. No biometric data is
              stored or transmitted to external servers.
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1 bg-transparent">
            Reset to Default
          </Button>
          <Button className="flex-1">Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
