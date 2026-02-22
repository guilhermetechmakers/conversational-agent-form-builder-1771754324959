import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const sessionsData = [
  { date: 'Feb 16', sessions: 120, completions: 85 },
  { date: 'Feb 17', sessions: 145, completions: 102 },
  { date: 'Feb 18', sessions: 98, completions: 72 },
  { date: 'Feb 19', sessions: 167, completions: 118 },
  { date: 'Feb 20', sessions: 134, completions: 95 },
  { date: 'Feb 21', sessions: 189, completions: 142 },
  { date: 'Feb 22', sessions: 156, completions: 112 },
]

const agentData = [
  { name: 'Lead Capture', sessions: 456, conversion: 72 },
  { name: 'Support Qualifier', sessions: 312, conversion: 68 },
  { name: 'Event Registration', sessions: 89, conversion: 45 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Agent performance and key metrics
          </p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions over time</CardTitle>
            <CardDescription>Sessions and completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionsData}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="date" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="rgb(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke="rgb(var(--success))"
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent metrics</CardTitle>
            <CardDescription>Sessions and conversion by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis type="number" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgb(var(--muted-foreground))"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sessions" fill="rgb(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Download analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              Export CSV
            </button>
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              Export PDF
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
