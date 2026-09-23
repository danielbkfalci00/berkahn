export default function LeadsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-5" role="status" aria-label="Carregando leads">
      <div className="h-8 w-28 rounded bg-neutral-200" />
      <div className="h-14 rounded bg-neutral-100" />
      <div className="flex gap-2 overflow-hidden"><div className="h-11 w-20 shrink-0 rounded-full bg-neutral-200" /><div className="h-11 w-24 shrink-0 rounded-full bg-neutral-200" /><div className="h-11 w-24 shrink-0 rounded-full bg-neutral-200" /></div>
      <div className="space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-28 rounded-lg border border-neutral-200 bg-neutral-100" />)}</div>
      <span className="sr-only">Carregando leads…</span>
    </div>
  );
}
