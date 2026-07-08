import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PersonaCardSkeleton() {
  return (
    <Card className="gap-5 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40 rounded-full" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PersonaSkeletonGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <PersonaCardSkeleton key={i} />
      ))}
    </div>
  );
}
