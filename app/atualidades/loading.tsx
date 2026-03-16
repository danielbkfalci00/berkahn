export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16 animate-pulse">
      <div className="h-8 bg-black-5 rounded w-1/3 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-black-5 rounded" />
            <div className="h-4 bg-black-5 rounded w-1/4" />
            <div className="h-6 bg-black-5 rounded w-3/4" />
            <div className="h-4 bg-black-5 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
