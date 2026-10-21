// Placeholder shaped like "My orders", shown while statuses load
function OrdersSkeleton() {
  return (
    <div className="mx-auto max-w-4xl" aria-busy="true" aria-label="Loading your orders">
      <div className="space-y-4">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-12 w-56 rounded-lg" />
        <div className="skeleton h-4 w-96 max-w-full rounded-full" />
      </div>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="skeleton h-7 w-40 rounded-md" />
              <div className="skeleton h-4 w-64 max-w-full rounded-full" />
              <div className="flex -space-x-3">
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} className="skeleton h-10 w-10 rounded-full ring-2 ring-bg" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-9 w-20 rounded-full" />
              <div className="skeleton h-9 w-32 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersSkeleton;
