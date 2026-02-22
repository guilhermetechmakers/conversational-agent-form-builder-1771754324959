export function SessionViewerSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#181B20] text-white animate-pulse">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#181B20] to-[#23262B]">
        <div className="space-y-2">
          <div className="h-8 bg-[#31343A] rounded w-48" />
          <div className="h-4 bg-[#31343A] rounded w-32 mt-2" />
        </div>
        <div className="h-6 bg-[#31343A] rounded-full w-24" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col w-16 bg-[#181B20]" />
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md">
            <div className="h-6 bg-[#31343A] rounded w-24 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-[#31343A] rounded-lg"
                  style={{ width: `${70 + (i % 2) * 15}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md">
            <div className="h-6 bg-[#31343A] rounded w-36 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-8 bg-[#31343A] rounded" />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 bg-[#31343A] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
