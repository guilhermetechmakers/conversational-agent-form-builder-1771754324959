import { useRef } from 'react'
import { MessageSquare, Upload, User } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'sales-y', label: 'Sales-y' },
]

export interface PersonaSettingsProps {
  tone: string
  systemInstructions: string
  avatarUrl?: string
  onToneChange: (value: string) => void
  onSystemInstructionsChange: (value: string) => void
  onAvatarChange: (url: string | null) => void
}

export function PersonaSettings({
  tone,
  systemInstructions,
  avatarUrl,
  onToneChange,
  onSystemInstructionsChange,
  onAvatarChange,
}: PersonaSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.type.startsWith('image/')) {
      onAvatarChange(URL.createObjectURL(file))
    }
    e.target.value = ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Persona
        </CardTitle>
        <CardDescription>Tone, system instructions, and avatar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>System instructions</Label>
          <Textarea
            value={systemInstructions}
            onChange={(e) => onSystemInstructionsChange(e.target.value)}
            placeholder="How should the agent behave? What persona to adopt?"
            rows={4}
            className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Avatar</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={avatarUrl} alt="Agent avatar" />
              <AvatarFallback>
                <User className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload avatar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onAvatarChange(null)}
                className="text-muted-foreground"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
