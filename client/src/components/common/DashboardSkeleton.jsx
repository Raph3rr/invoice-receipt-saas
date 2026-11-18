const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <span className="font-extrabold text-xl tracking-tight text-blue-600">
          SELLZA
        </span>
        <SkeletonBlock className="w-8 h-8 rounded-md" />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-200 p-4 flex-col">
        <div className="mb-10">
          <span className="block font-extrabold text-2xl tracking-tight text-blue-600">
            SELLZA
          </span>
          <SkeletonBlock className="h-2 w-36 mt-2" />
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                index === 0 ? "bg-blue-50" : ""
              }`}
            >
              <SkeletonBlock className="w-5 h-5 rounded" />
              <SkeletonBlock
                className={`h-3 ${index === 0 ? "w-24" : "w-28"}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <SkeletonBlock className="h-3 w-full mb-4" />
          <SkeletonBlock className="h-8 w-full rounded-md" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <SkeletonBlock className="h-7 w-36 sm:w-48 mb-2" />
            <SkeletonBlock className="h-3 w-44 sm:w-64" />
          </div>
          <SkeletonBlock className="hidden sm:block h-9 w-28 rounded-md" />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="w-9 h-9 rounded-lg" />
              </div>
              <SkeletonBlock className="h-7 w-32 mb-3" />
              <SkeletonBlock className="h-2.5 w-24" />
            </div>
          ))}
        </div>

        {/* Main dashboard sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Recent sales */}
          <section className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="h-8 w-24 rounded-md" />
            </div>

            {/* Table heading */}
            <div className="hidden sm:grid grid-cols-4 gap-4 pb-3 border-b border-gray-100">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-3 w-16" />
              ))}
            </div>

            {/* Table rows */}
            <div className="space-y-5 pt-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <SkeletonBlock className="h-3 w-28 mb-2" />
                    <SkeletonBlock className="h-2.5 w-20 sm:hidden" />
                  </div>
                  <SkeletonBlock className="hidden sm:block h-3 w-20" />
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Secondary dashboard panel */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <SkeletonBlock className="h-5 w-36 mb-6" />

            <div className="flex items-end justify-between gap-2 h-40 mb-5">
              {[45, 70, 55, 85, 60, 95, 65].map((height, index) => (
                <SkeletonBlock
                  key={index}
                  className="flex-1 rounded-t-md rounded-b-none"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="space-y-4">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-4/5" />
              <SkeletonBlock className="h-3 w-3/5" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
