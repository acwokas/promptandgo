export const PromptCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 space-y-4">
    <div className="skeleton h-4 w-3/4 rounded" />
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-5/6 rounded" />
    <div className="flex gap-2 mt-4">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const OptimizerResultSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <div className="skeleton h-8 w-8 rounded-lg" />
      <div className="skeleton h-4 w-40 rounded" />
    </div>
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-4/5 rounded" />
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-3/4 rounded" />
  </div>
);
