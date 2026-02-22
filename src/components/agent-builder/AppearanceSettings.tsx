import { Palette, Sun, Moon, ImageIcon } from 'lucide-react'
import { DESIGN_TOKENS } from '@/lib/design-tokens'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const PRIMARY_COLOR_INPUT_ID = 'appearance-primary-color'
const ACCENT_COLOR_INPUT_ID = 'appearance-accent-color'

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
          <Palette className="h-5 w-5 text-primary" aria-hidden />
          Appearance
        </CardTitle>
        <CardDescription>Primary color, accent, theme, and logo preview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor={PRIMARY_COLOR_INPUT_ID}>Primary color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id={`${PRIMARY_COLOR_INPUT_ID}-picker`}
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="h-10 w-14 min-w-14 rounded-lg border border-border cursor-pointer bg-card p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Primary color picker"
              />
              <Input
                id={PRIMARY_COLOR_INPUT_ID}
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                placeholder={DESIGN_TOKENS.primaryHex}
                className="font-mono flex-1"
                aria-label="Primary color hex value"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={ACCENT_COLOR_INPUT_ID}>Accent color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id={`${ACCENT_COLOR_INPUT_ID}-picker`}
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="h-10 w-14 min-w-14 rounded-lg border border-border cursor-pointer bg-card p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Accent color picker"
              />
              <Input
                id={ACCENT_COLOR_INPUT_ID}
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                placeholder={DESIGN_TOKENS.secondaryAccentHex}
                className="font-mono flex-1"
                aria-label="Accent color hex value"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label id="appearance-theme-label">Theme</Label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="appearance-theme-label"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => onThemeChange('light')}
              className={cn(
                'flex items-center gap-2 transition-all duration-200',
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'border-border hover:border-primary/50'
              )}
              aria-pressed={theme === 'light'}
              aria-label="Light theme"
            >
              <Sun className="h-4 w-4" aria-hidden />
              Light
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onThemeChange('dark')}
              className={cn(
                'flex items-center gap-2 transition-all duration-200',
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'border-border hover:border-primary/50'
              )}
              aria-pressed={theme === 'dark'}
              aria-label="Dark theme"
            >
              <Moon className="h-4 w-4" aria-hidden />
              Dark
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label id="appearance-logo-label">Logo / Avatar preview</Label>
          <div
            className="rounded-lg border p-6 flex items-center justify-center min-h-[120px] transition-all duration-300"
            style={
              {
                '--preview-primary': primaryColor,
                backgroundColor: 'color-mix(in srgb, var(--preview-primary) 9%, transparent)',
                borderColor: 'color-mix(in srgb, var(--preview-primary) 25%, transparent)',
              } as React.CSSProperties
            }
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo preview"
                className="max-h-16 max-w-32 object-contain"
              />
            ) : (
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center font-semibold text-xl text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                <span aria-hidden>A</span>
              </div>
            )}
          </div>
          {!logoUrl && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4 shrink-0" aria-hidden />
              Avatar will appear here when configured in Persona settings
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
