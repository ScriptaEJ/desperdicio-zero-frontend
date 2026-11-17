export default function AutoSendCard({ enabled, schedule, email, onToggle }) {
  return (
    <section className="mt-4 flex items-center justify-between gap-3 rounded-[20px] border border-[#e8eae6] bg-white px-6 py-[22px]">
      <div>
        <strong className="text-[15px] text-[#16211c]">Envio automático ao proprietário</strong>
        <small className="mt-2 block text-xs text-[#76807b]">
          {schedule} para {email}
        </small>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-[13px] font-semibold text-[#16211c]">
        <span>{enabled ? 'Ativado' : 'Desativado'}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="size-[18px] cursor-pointer accent-[#0f6b4f]"
        />
      </label>
    </section>
  );
}