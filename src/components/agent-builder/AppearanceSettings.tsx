import { Palette, Sun, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface AppearanceSettingsProps {
  primaryColor: string
  accentColor: string
  theme: 'light' | 'dark'
  logoUrl?: string
  onPrimaryColorChange: (value: string) => void
  onAccentColorChange: (value: string) => void
  onThemeChange: (value: 'light' | 'dark') => void
  onLogoChange?: (url: string | null) => void
}

export function AppearanceSettings({
  primaryColor,
  accentColor,
  theme,
  logoUrl,
  onPrimaryColorChange,
  onAccentColorChange,
  onThemeChange,
}: AppearanceSettingsProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>Primary color, accent, theme, and logo preview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="h-10 w-14 rounded-lg border border-border cursor-pointer bg-transparent"
                aria-label="Primary color"
              />
              <Input
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                placeholder="#26C6FF"
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="h-10 w-14 rounded-lg border border-border cursor-pointer bg-transparent"
                aria-label="Accent color"
              />
              <Input
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                placeholder="#00FF66"
                className="font-mono"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Logo / Avatar preview</Label>
          <div
            className="rounded-lg border border-border p-6 flex items-center justify-center min-h-[120px]"
            style={{
              backgroundColor: primaryColor + '15',
              borderColor: primaryColor + '40',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo preview"
                className="max-h-16 max-w-32 object-contain"
              />
            ) : (
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-white font-semibold text-xl"
                style={{ backgroundColor: primaryColor }}
              >
                A
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
