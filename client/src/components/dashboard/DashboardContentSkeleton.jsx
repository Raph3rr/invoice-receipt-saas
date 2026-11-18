const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const DashboardContentSkeleton = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard heading */}
      <div className="mb-6">
        <SkeletonBlock className="h-7 w-48 mb-2" />
        <SkeletonBlock className="h-3 w-56 mb-2" />
        <SkeletonBlock className="h-3 w-40" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <SkeletonBlock className="h-3 w-24 mb-5" />
            <SkeletonBlock className="h-7 w-28 mb-3" />
            <SkeletonBlock className="h-2.5 w-20" />
          </div>
        ))}
      </div>

      {/* Storefront promotion placeholder */}
      <div className="mt-8 mb-8 bg-white border border-gray-200 rounded-xl p-6">
        <SkeletonBlock className="h-5 w-56 mb-4" />
        <SkeletonBlock className="h-3 w-full max-w-xl mb-2" />
        <SkeletonBlock className="h-3 w-4/5 max-w-lg mb-5" />
        <SkeletonBlock className="h-9 w-36 rounded-md" />
      </div>

      {/* Recent sales */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-4 w-16" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <SkeletonBlock className="h-3 w-36" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContentSkeleton;
