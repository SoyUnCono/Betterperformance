import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TweakDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen pb-6">
      {/* Header Skeleton */}
      <div className="h-[60px] bg-background/60 backdrop-blur-xl w-full flex items-center px-6">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-lg border shadow-lg bg-background/60 backdrop-blur-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </Card>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="relative">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>

              <div className="space-y-6">
                {/* Author Section */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-32 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
