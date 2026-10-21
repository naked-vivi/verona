function OrderSkeleton() {
  return (
    <div
      className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16"
      aria-busy="true"
      aria-label="Loading your order"
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          <div className="skeleton h-7 w-28 rounded-full" />
          <div className="skeleton h-7 w-24 rounded-full" />
        </div>
        <div className="skeleton mt-6 h-40 w-40 rounded-full sm:h-48 sm:w-48" />
        <div className="skeleton mt-6 h-16 w-72 max-w-full rounded-lg" />
        <div className="skeleton mt-5 h-5 w-80 max-w-full rounded-full" />
        <div className="skeleton mt-10 h-4 w-full max-w-md rounded-full" />
      </div>
      <div className="skeleton h-[32rem] rounded-sm" />
    </div>
  );
}

export default OrderSkeleton;
