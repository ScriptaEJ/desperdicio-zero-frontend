// src/components/InsumoModal/InsumoModal.jsx
import { useEffect, useState } from 'react';

const CATEGORIAS = [
  'Hortifruti',
  'Laticínio',
  'Proteínas',
  'Mercearia',
  'Bebidas',
  'Outros',
];

const UNIDADES = ['kg', 'g', 'L', 'ml', 'unidade'];

export default function InsumoModal({ isOpen, onClose, onSave, initialData = null }) {
  const isEditing = Boolean(initialData);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Hortifruti');
  const [unidade, setUnidade] = useState('kg');
  const [preco, setPreco] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setNome(initialData.nome || '');
      setCategoria(initialData.categoria || 'Hortifruti');
      setUnidade(initialData.unidade || 'kg');
      setPreco(
        initialData.preco != null
          ? Number(initialData.preco).toFixed(2).replace('.', ',')
          : ''
      );
      setEstoqueMinimo(
        initialData.estoqueMinimo != null
          ? String(initialData.estoqueMinimo).replace('.', ',')
          : ''
      );
      setAtivo(initialData.ativo ?? true);
    } else {
      setNome('');
      setCategoria('Hortifruti');
      setUnidade('kg');
      setPreco('');
      setEstoqueMinimo('');
      setAtivo(true);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPreco = parseFloat(String(preco).replace(',', '.')) || 0;
    const trimmedEstoque = String(estoqueMinimo).trim();
    const parsedEstoque =
      trimmedEstoque === ''
        ? null
        : parseFloat(trimmedEstoque.replace(',', '.')) || 0;

    onSave({
      id: initialData?.id ?? Date.now(),
      nome: nome.trim(),
      categoria,
      unidade,
      preco: parsedPreco,
      estoqueMinimo: parsedEstoque,
      perdaMes: initialData?.perdaMes ?? 0,
      ativo,
    });

    onClose();
  };

  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';
  const inputClass =
    'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-800 bg-white';
  const selectClass =
    'w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:border-brand-800 cursor-pointer';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-[490px] max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fixo */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 border-b border-slate-100 shrink-0">
          <div>
            <span className="block text-[11px] font-bold tracking-wider text-brand-800 uppercase">
              {isEditing ? 'Edição' : 'Cadastro'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {isEditing ? 'Editar insumo' : 'Novo insumo'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre os dados usados nos cálculos de custo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Formulário com corpo rolável e rodapé fixo */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto px-5 py-4 sm:px-7 space-y-4">
            <div>
              <label className={labelClass}>Nome do insumo</label>
              <input
                type="text"
                required
                placeholder="Ex.: Batata inglesa"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClass}>Categoria</label>
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={selectClass}
                  >
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              <div>
                <label className={labelClass}>Unidade</label>
                <div className="relative">
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className={selectClass}
                  >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClass}>Preço (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="0,00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estoque mínimo</label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Opcional"
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 bg-[#F3F5F4] rounded-xl px-4 py-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-4 h-4 rounded-[4px] border border-slate-300 bg-white peer-checked:bg-brand-800 peer-checked:border-brand-800 flex items-center justify-center text-white transition-colors shrink-0">
                {ativo && (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-xs font-medium text-slate-700">
                Insumo ativo e disponível para registros de perda
              </span>
            </label>
          </div>

          {/* Rodapé Fixo */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-4 px-5 py-4 sm:px-7 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2.5 sm:py-2 rounded-lg text-center transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-brand-800 hover:opacity-95 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-opacity cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{isEditing ? 'Salvar alterações' : 'Cadastrar insumo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="w-4 h-4 text-slate-600 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}