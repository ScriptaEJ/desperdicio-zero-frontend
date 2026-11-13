import { LeafIcon } from '../Icons/Icons';

export default function Logo() {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-xl bg-white text-brand-800">
        <LeafIcon size={22} />
      </span>
      <span className="flex flex-col text-[17px] font-bold leading-[1.1] tracking-tight text-white">
        Desperdício
        <strong className="font-bold text-accent">Zero</strong>
      </span>
    </div>
  );
}
