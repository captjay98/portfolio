import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen">
      {/* Skeleton for category filter */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 bg-glass shadow-subtle rounded-lg px-2 py-1 backdrop-blur-md max-w-[90vw] overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 md:space-x-2 py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="w-20 h-7 rounded-md bg-light-subtle/10 dark:bg-dark-subtle/10"
            />
          ))}
        </div>
      </div>

      {/* Skeleton for project card */}
      <div className="h-screen w-full flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-5xl md:max-w-7xl md:h-[40vh] bg-glass rounded-xl shadow-elevated overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            {/* Image skeleton */}
            <div className="relative h-[30vh] md:h-auto md:w-1/2">
              <Skeleton className="absolute inset-0 w-full h-full" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 p-5 md:p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-6" />

              <div className="flex justify-around mt-auto pt-3">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton for navigation buttons */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Skeleton for project indicators */}
      <div className="fixed left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </main>
  );
}
