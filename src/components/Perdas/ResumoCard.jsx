export function ResumoCard({ titulo, valor, detalhe }) {
  return (
    <article className="flex flex-col gap-2 rounded-[20px] border border-[#e3e9e5] bg-white p-5">
      <span className="text-[13px] text-[#6b7c73]">{titulo}</span>
      <strong className="text-[22px] tracking-tight text-[#12261d]">{valor}</strong>
      <span className="text-xs text-[#6b7c73]">{detalhe}</span>
    </article>
  );
}