export default function StepIndicator({ current, total }) {
  return (
    <div className="mb-9 flex items-center justify-between">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[5px] w-12 rounded-full transition-colors ${
              i < current ? 'bg-brand-800' : 'bg-brand-800/15'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted">
        Etapa {current} de {total}
      </span>
    </div>
  );
}
