export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5" role="status" aria-label="Carregando painel">
      <div className="h-7 w-44 animate-pulse rounded bg-neutral-200 motion-reduce:animate-none" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 motion-reduce:animate-none" />
        ))}
      </div>
      <div className="h-36 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 motion-reduce:animate-none" />
      <span className="sr-only">Carregando painel</span>
    </div>
  );
}
