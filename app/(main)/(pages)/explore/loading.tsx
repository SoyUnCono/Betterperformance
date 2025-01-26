import { TweakSkeletonList } from "@/app/(main)/components/skeleton-components/tweak-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Filters */}
        <Card className="p-4 lg:col-span-3 h-fit">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </Card>

        {/* Right Column - Tweaks */}
        <div className="lg:col-span-9">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Tweaks List */}
          <TweakSkeletonList />
        </div>
      </div>
    </div>
  );
}
