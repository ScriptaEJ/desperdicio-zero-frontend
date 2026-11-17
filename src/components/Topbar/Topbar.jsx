// src/components/Topbar/Topbar.jsx
export default function Topbar({
  restaurantName = 'Casa da Vila',
  onOpenRegisterLoss,
  onOpenMobileMenu,
}) {
  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shrink-0">
      {/* Esquerda: Botão Menu Mobile + Seletor de Restaurante */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu"
          className="lg:hidden w-10 h-10 -ml-1 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <div className="min-w-0">
          <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Restaurante
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-slate-950 mt-0.5 max-w-full cursor-pointer"
          >
            <span className="truncate">{restaurantName}</span>
            <svg
              className="w-4 h-4 text-slate-500 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Direita: Notificações + Registrar perda */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          aria-label="Notificações"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onOpenRegisterLoss}
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-800 hover:opacity-95 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-opacity cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" strokeLinecap="round" />
          </svg>
          <span>Registrar perda</span>
        </button>
      </div>
    </header>
  );
}