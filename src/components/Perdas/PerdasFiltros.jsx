import { MOTIVOS } from '../../types/perda';

export function PerdasFiltros({ busca, onBusca, motivo, onMotivo }) {
  return (
    <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row">
      <label className="flex w-full items-center gap-2.5 rounded-xl border border-[#e3e9e5] px-3.5 text-[#6b7c73] focus-within:ring-2 focus-within:ring-[#14573f] sm:w-80">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Buscar por insumo..."
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          className="h-11 flex-1 bg-transparent text-sm text-[#12261d] outline-none placeholder:text-[#6b7c73]"
        />
      </label>

      <select
        value={motivo}
        onChange={(e) => onMotivo(e.target.value)}
        aria-label="Filtrar por motivo"
        className="h-10 rounded-[10px] border border-[#e3e9e5] bg-white px-3.5 text-[13px] font-semibold text-[#12261d] focus:outline-none focus:ring-2 focus:ring-[#14573f]"
      >
        <option value="">Todos os motivos</option>
        {MOTIVOS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}