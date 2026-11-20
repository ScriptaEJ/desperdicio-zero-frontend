// src/components/Topbar/Topbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Topbar({
  onOpenRegisterLoss,
  onOpenMobileMenu,
  onSelectRestaurant,
}) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [selectedId, setSelectedId] = useState(() =>
    localStorage.getItem('restaurante_id')
  );
  const [carregando, setCarregando] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    let ativo = true;

    api
      .get('/restaurantes/', { params: { page: 1, size: 50 } })
      .then(({ data }) => {
        if (!ativo) return;
        const lista = Array.isArray(data) ? data : data?.items ?? [];
        setRestaurantes(lista);

        if (lista.length > 0) {
          const salvoExiste = lista.some(
            (r) => String(r.id) === String(selectedId)
          );
          const idAtivo = salvoExiste ? String(selectedId) : String(lista[0].id);
          setSelectedId(idAtivo);
          localStorage.setItem('restaurante_id', idAtivo);
        }
      })
      .catch(() => {
        // Mantém fallback silencioso se ainda não houver restaurante
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const activeRestaurant =
    restaurantes.find((r) => String(r.id) === String(selectedId)) ||
    restaurantes[0] ||
    null;

  const handleSelect = (restaurante) => {
    const novoId = String(restaurante.id);
    setSelectedId(novoId);
    localStorage.setItem('restaurante_id', novoId);
    setDropdownOpen(false);
    onSelectRestaurant?.(restaurante);
  };

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

        <div className="relative min-w-0" ref={dropdownRef}>
          <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Restaurante
          </span>

          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-slate-950 mt-0.5 max-w-full cursor-pointer"
          >
            <span className="truncate">
              {carregando
                ? 'Carregando...'
                : activeRestaurant?.nome || 'Sem restaurante'}
            </span>
            <svg
              className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200/90 shadow-lg py-1.5 z-50">
              {restaurantes.length === 0 ? (
                <p className="px-3.5 py-2 text-xs text-slate-500">
                  Nenhum restaurante encontrado.
                </p>
              ) : (
                <div className="max-h-56 overflow-y-auto">
                  {restaurantes.map((item) => {
                    const isSelected = String(item.id) === String(activeRestaurant?.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`w-full px-3.5 py-2 text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E7F3EC] text-[#145338] font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{item.nome}</span>
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-[#145338] shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                <Link
                  to="/configuracoes"
                  onClick={() => setDropdownOpen(false)}
                  className="block rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-800 hover:bg-slate-50"
                >
                  Configurar restaurante →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direita: Registrar perda */}
      <div className="flex items-center shrink-0">
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