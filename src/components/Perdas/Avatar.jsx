import { iniciais } from '../../utils/format';

export const Avatar = ({ nome }) => (
  <span
    title={nome}
    className="inline-grid h-8 w-8 place-items-center rounded-full bg-[#e6f0eb] text-[11px] font-bold text-[#1d5a43]"
  >
    {iniciais(nome)}
  </span>
);