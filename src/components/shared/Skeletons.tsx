export const PostCardSkeleton = () => (
  <div className="post-card animate-pulse">
    <div className="flex-between">
      <div className="flex cursor-pointer gap-3">
        <div className="h-12 w-12 rounded-full bg-dark-3" />
        <div className="flex flex-col">
          <div className="h-4 w-24 bg-dark-3 rounded" />
          <div className="mt-1 h-3 w-16 bg-dark-3 rounded" />
        </div>
      </div>
      <div className="h-6 w-6 bg-dark-3 rounded" />
    </div>

    <div className="small-medium lg:base-medium py-5">
      <div className="h-4 w-full bg-dark-3 rounded mb-2" />
      <div className="h-4 w-3/4 bg-dark-3 rounded" />
    </div>

    <div className="relative mb-5 w-full max-h-480">
      <div className="h-72 w-full bg-dark-3 rounded-[30px]" />
    </div>

    <div className="flex gap-2">
      <div className="h-8 w-8 bg-dark-3 rounded" />
      <div className="h-8 w-8 bg-dark-3 rounded" />
    </div>
  </div>
);

export const UserCardSkeleton = () => (
  <div className="user-card animate-pulse">
    <img
      src="/assets/icons/loader.svg"
      alt="loader"
      width={20}
      height={20}
      className="absolute left-3 top-3 animate-spin opacity-0"
    />

    <div className="flex-center flex-col gap-3">
      <div className="h-14 w-14 rounded-full bg-dark-3" />

      <div className="flex-center flex-col gap-1">
        <div className="h-4 w-32 bg-dark-3 rounded" />
        <div className="h-3 w-24 bg-dark-3 rounded" />
      </div>

      <div className="h-8 w-full bg-dark-3 rounded-lg" />
    </div>
  </div>
);

export const CourseCardSkeleton = () => (
  <div className="course-card animate-pulse">
    <div className="h-40 bg-dark-3 rounded-lg mb-4" />
    <div className="h-6 w-3/4 bg-dark-3 rounded mb-2" />
    <div className="h-4 w-full bg-dark-3 rounded mb-2" />
    <div className="h-4 w-2/3 bg-dark-3 rounded" />
  </div>
);

export const LoadingGrid = ({
  count = 6,
  skeleton: SkeletonComponent = UserCardSkeleton,
}: {
  count?: number;
  skeleton?: React.ComponentType;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <SkeletonComponent />
      </div>
    ))}
  </div>
);

export const LoadingList = ({
  count = 5,
  skeleton: SkeletonComponent = PostCardSkeleton,
}: {
  count?: number;
  skeleton?: React.ComponentType;
}) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <SkeletonComponent />
      </div>
    ))}
  </div>
);
