// Placeholder shaped like the menu, shown while the pizzas load
function MenuSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the menu">
      <div className="mb-10 space-y-4">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-12 w-64 rounded-lg" />
        <div className="skeleton h-4 w-72 max-w-full rounded-full" />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <div className="skeleton h-11 w-full rounded-full sm:w-80" />
        <div className="skeleton h-11 w-24 rounded-full" />
        <div className="skeleton h-11 w-32 rounded-full" />
        <div className="skeleton h-11 w-32 rounded-full" />
      </div>

      <ul className="grid gap-x-12 md:grid-cols-2">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="flex gap-5 border-b border-line py-6">
            <div className="skeleton h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28" />
            <div className="flex grow flex-col gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="skeleton h-6 w-40 rounded-md" />
                <div className="ml-auto skeleton h-4 w-14 rounded-full" />
              </div>
              <div className="skeleton h-3 w-4/5 rounded-full" />
              <div className="mt-auto skeleton h-9 w-32 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuSkeleton;
