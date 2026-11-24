export function StatusBadge({ blocked }: { blocked: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
      {blocked ? 'Blocked' : 'Open'}
    </span>
  );
}