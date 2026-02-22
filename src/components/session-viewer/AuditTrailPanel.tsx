import { Activity, AlertCircle } from 'lucide-react'
import type { AuditLogEntry } from '@/types'

export interface AuditTrailPanelProps {
  logs: AuditLogEntry[]
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function AuditTrailPanel({
  logs,
  isLoading = false,
  error = null,
  onRetry,
}: AuditTrailPanelProps) {
  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-[#31343A] rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-[#FFD600] mb-4" />
          <p className="text-sm text-[#FFD600] mb-2">Failed to load audit trail</p>
          <p className="text-sm text-[#C0C6D1] mb-4">{error.message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
        <div
          className="flex flex-col items-center justify-center h-48 text-[#C0C6D1]"
          role="status"
        >
          <Activity className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold mt-4 text-white">No audit events</p>
          <p className="text-sm text-[#C0C6D1] mt-2">
            Webhook deliveries and actions will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-2 text-sm text-[#C0C6D1]"
          >
            <span className="text-xs text-[#C0C6D1] shrink-0">
              {new Date(log.timestamp).toLocaleString()}
            </span>
            <span>{log.action}</span>
            {log.details && (
              <span className="text-[#C0C6D1] truncate">— {log.details}</span>
            )}
            {log.isRetry && (
              <span className="text-xs bg-[#FFD600] text-[#181B20] rounded-full px-2 py-0.5 shrink-0">
                Retry
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
