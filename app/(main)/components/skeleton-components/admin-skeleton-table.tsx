import { Skeleton } from "@/components/ui/skeleton";

export function AdminTableSkeleton() {
  return (
    <div className="rounded-md border">
      {/* Table Header */}
      <div className="border-b bg-secondary/5 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[150px]" />
        </div>
      </div>

      {/* Table Content */}
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Icon and Title */}
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[300px]" />
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
