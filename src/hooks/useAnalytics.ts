import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchAnalyticsWithFallback,
  type AnalyticsDateRange,
} from '@/api/analytics'
import type { ApiError } from '@/lib/api'

export const analyticsKeys = {
  all: ['analytics'] as const,
  data: (range: AnalyticsDateRange) =>
    [...analyticsKeys.all, 'data', range] as const,
}

export function useAnalytics(range: AnalyticsDateRange = '7d') {
  return useQuery({
    queryKey: analyticsKeys.data(range),
    queryFn: () =>
      fetchAnalyticsWithFallback(range, (err) => {
        const message =
          (err as ApiError)?.message ?? 'Analytics API unavailable'
        toast.error(message, {
          description: 'Showing demo data. Check your connection or API configuration.',
        })
      }),
  })
}
