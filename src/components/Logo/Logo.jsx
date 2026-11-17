import { LeafIcon } from '../Icons/Icons';

export default function Logo({ variant = 'light' }) {
  const isDark = variant === 'dark';

  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={`grid size-11 place-items-center rounded-xl ${
          isDark ? 'bg-brand-800 text-white' : 'bg-white text-brand-800'
        }`}
      >
        <LeafIcon size={22} />
      </span>

      <span
        className={`flex flex-col text-[17px] font-bold leading-[1.1] tracking-tight ${
          isDark ? 'text-slate-900' : 'text-white'
        }`}
      >
        Desperdício
        <strong className={`font-bold ${isDark ? 'text-brand-800' : 'text-accent'}`}>
          Zero
        </strong>
      </span>
    </div>
  );
}