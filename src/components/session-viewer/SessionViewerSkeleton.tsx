import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SessionViewerSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)] bg-background text-foreground animate-pulse -m-4 md:-m-6 overflow-hidden">
      {/* Header skeleton */}
      <header className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-background to-card shrink-0">
        <div className="space-y-2 min-w-0">
          <Skeleton className="h-8 w-48 skeleton-shimmer" />
          <Skeleton className="h-4 w-32 skeleton-shimmer" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full shrink-0 skeleton-shimmer" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton - hidden on mobile */}
        <aside className="hidden md:flex flex-col w-16 bg-background shrink-0" />

        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-4 sm:space-y-6 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {/* Transcript panel skeleton */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-24 skeleton-shimmer" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className={cn(
                        'h-12 rounded-lg skeleton-shimmer',
                        i % 2 === 0 ? 'w-[85%]' : 'w-[70%]'
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Extracted data panel skeleton */}
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-36 skeleton-shimmer" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-8 w-full rounded skeleton-shimmer"
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-9 w-20 sm:w-24 rounded-lg skeleton-shimmer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
