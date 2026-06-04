export function SkeletonLoader({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border">
      <SkeletonLoader className="aspect-[4/3] w-full" />
      <div className="p-4">
        <SkeletonLoader className="h-6 w-3/4 mb-3" />
        <SkeletonLoader className="h-4 w-1/2 mb-2" />
        <SkeletonLoader className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonLoader className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 border border-border">
          <SkeletonLoader className="h-4 w-24 mb-2" />
          <SkeletonLoader className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
