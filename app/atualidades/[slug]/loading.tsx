export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16 animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="h-6 bg-black-5 rounded w-1/4 mb-6" />
        <div className="h-10 bg-black-5 rounded w-2/3 mb-4" />
        <div className="h-5 bg-black-5 rounded w-1/2 mb-8" />
        <div className="h-80 bg-black-5 rounded mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-black-5 rounded w-full" />
          <div className="h-4 bg-black-5 rounded w-5/6" />
          <div className="h-4 bg-black-5 rounded w-4/6" />
          <div className="h-4 bg-black-5 rounded w-full" />
          <div className="h-4 bg-black-5 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}
