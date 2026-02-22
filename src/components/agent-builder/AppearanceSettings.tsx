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
    <Card className="bg-secondary-800 p-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-card-hover border-divider">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Palette className="h-5 w-5 text-accent-500" aria-hidden />
          Appearance
        </CardTitle>
        <CardDescription className="text-secondary-500">Primary color, accent, theme, and logo preview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-4 flex-wrap gap-4">
          <div className="space-y-2">
            <Label htmlFor={PRIMARY_COLOR_INPUT_ID} className="text-white">Primary color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id={`${PRIMARY_COLOR_INPUT_ID}-picker`}
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="color-input bg-primary-700 rounded-full w-10 h-10 cursor-pointer border border-divider focus:ring-2 focus:ring-accent-500"
                aria-label="Primary color picker"
              />
              <Input
                id={PRIMARY_COLOR_INPUT_ID}
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                placeholder={DESIGN_TOKENS.primaryHex}
                className="font-mono flex-1 bg-primary-700 text-white rounded p-3 focus:ring-2 focus:ring-accent-500"
                aria-label="Primary color hex value"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={ACCENT_COLOR_INPUT_ID} className="text-white">Accent color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id={`${ACCENT_COLOR_INPUT_ID}-picker`}
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="color-input bg-primary-700 rounded-full w-10 h-10 cursor-pointer border border-divider focus:ring-2 focus:ring-accent-500"
                aria-label="Accent color picker"
              />
              <Input
                id={ACCENT_COLOR_INPUT_ID}
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                placeholder={DESIGN_TOKENS.secondaryAccentHex}
                className="font-mono flex-1 bg-primary-700 text-white rounded p-3 focus:ring-2 focus:ring-accent-500"
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
