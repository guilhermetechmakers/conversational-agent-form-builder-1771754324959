import { User, Globe, Monitor } from 'lucide-react'

export interface VisitorInfo {
  ip?: string
  userAgent?: string
  referrer?: string
  sessionCount?: number
}

export interface RelatedSessionsPanelProps {
  visitorInfo?: VisitorInfo
  relatedSessionIds?: string[]
}

export function RelatedSessionsPanel({
  visitorInfo,
  relatedSessionIds = [],
}: RelatedSessionsPanelProps) {
  const hasVisitorInfo =
    visitorInfo &&
    (visitorInfo.ip || visitorInfo.userAgent || visitorInfo.referrer)
  const hasRelatedSessions = relatedSessionIds.length > 0

  if (!hasVisitorInfo && !hasRelatedSessions) {
    return (
      <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Related Sessions / Visitor Info
        </h2>
        <div
          className="flex flex-col items-center justify-center h-48 text-[#C0C6D1]"
          role="status"
        >
          <User className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold mt-4 text-white">
            No visitor data
          </p>
          <p className="text-sm text-[#C0C6D1] mt-2">
            Visitor metadata will appear when available
          </p>
        </div>
      </div>
    )
  }

  const infoItems: { label: string; value: string; icon?: React.ReactNode }[] =
    []

  if (visitorInfo?.ip) {
    infoItems.push({
      label: 'IP Address',
      value: visitorInfo.ip,
      icon: <Monitor className="h-4 w-4 text-[#C0C6D1] shrink-0" />,
    })
  }
  if (visitorInfo?.referrer) {
    infoItems.push({
      label: 'Referrer',
      value: visitorInfo.referrer,
      icon: <Globe className="h-4 w-4 text-[#C0C6D1] shrink-0" />,
    })
  }
  if (visitorInfo?.sessionCount !== undefined) {
    infoItems.push({
      label: 'Session Count',
      value: String(visitorInfo.sessionCount),
    })
  }
  if (relatedSessionIds.length > 0) {
    infoItems.push({
      label: 'Related Sessions',
      value: relatedSessionIds.join(', '),
    })
  }

  return (
    <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Related Sessions / Visitor Info
      </h2>
      <div className="space-y-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center gap-4"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span
              className="text-sm text-[#C0C6D1] truncate max-w-[200px]"
              title={item.value}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
