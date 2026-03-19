import { Skeleton } from "./Skeleton";

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 4 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-[140px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-6 w-[70px] rounded-full" />
          </div>
          <div className="py-4">
            <Skeleton className="h-[100px] w-full rounded-[12px]" />
          </div>
          <div className="space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-auto" />
        </div>
      ))}
    </div>
  );
}
