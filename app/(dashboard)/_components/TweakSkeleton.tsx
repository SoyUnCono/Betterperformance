import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TweakSkeleton() {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Icon */}
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Title and Description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function TweakSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <TweakSkeleton key={i} />
      ))}
    </div>
  );
}
