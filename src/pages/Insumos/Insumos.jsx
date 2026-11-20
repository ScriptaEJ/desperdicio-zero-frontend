// src/pages/Insumos/InsumosPage.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import InsumoModal from '../../components/InsumoModal/InsumoModal';
import {
  atualizarInsumo,
  criarInsumo,
  listarInsumos,
} from '../../services/insumosService';

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatQuantity = (value, unit) =>
  `${value.toLocaleString('pt-BR')} ${unit}`;

export default function InsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);

  const fetchInsumos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const lista = await listarInsumos();
      setInsumos(lista);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        'Não foi possível carregar os insumos. Verifique se a API está rodando na porta 5000.';
      setError(typeof detail === 'string' ? detail : 'Erro ao carregar insumos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsumos();
  }, [fetchInsumos]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(insumos.map((item) => item.categoria)));
    return ['Todas', ...unique];
  }, [insumos]);

  const filteredInsumos = useMemo(() => {
    return insumos.filter((item) => {
      const matchesSearch = item.nome
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === 'Todas' || item.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [insumos, search, selectedCategory]);

  const kpis = useMemo(() => {
    const ativos = insumos.filter((i) => i.ativo);
    const inativos = insumos.filter((i) => !i.ativo);
    const semEstoqueMinimo = insumos.filter(
      (i) => i.estoqueMinimo == null || i.estoqueMinimo === ''
    );
    const categoriasAtivas = new Set(ativos.map((i) => i.categoria)).size;
    const custoMedio =
      insumos.length > 0
        ? insumos.reduce((acc, item) => acc + item.preco, 0) / insumos.length
        : 0;

    return {
      totalAtivos: ativos.length,
      categoriasAtivas,
      totalInativos: inativos.length,
      semEstoqueMinimo: semEstoqueMinimo.length,
      custoMedio,
    };
  }, [insumos]);

  const handleOpenCreate = () => {
    setEditingInsumo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingInsumo(item);
    setIsModalOpen(true);
  };

  const handleSaveInsumo = async (formData) => {
    try {
      setError('');
      if (editingInsumo) {
        const atualizado = await atualizarInsumo(editingInsumo.id, formData);
        setInsumos((prev) =>
          prev.map((item) => (item.id === atualizado.id ? atualizado : item))
        );
      } else {
        const criado = await criarInsumo(formData);
        setInsumos((prev) => [criado, ...prev]);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail || 'Erro ao salvar o insumo no servidor.';
      setError(typeof detail === 'string' ? detail : 'Erro de validação nos dados.');
      throw err; // Mantém o modal aberto para o usuário corrigir
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-brand-800">Cadastros</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Insumos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie preços, unidades e níveis de estoque dos ingredientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-brand-800 hover:opacity-95 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity w-full sm:w-auto cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          <span>Novo insumo</span>
        </button>
      </div>

      {/* Banner de Erro da API */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-xs sm:text-sm flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchInsumos}
            className="font-semibold underline shrink-0 cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Cards de Resumo (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Insumos ativos</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 sm:mt-2">
            {loading ? '—' : kpis.totalAtivos}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {kpis.categoriasAtivas}{' '}
            {kpis.categoriasAtivas === 1 ? 'categoria' : 'categorias'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Insumos inativos</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 sm:mt-2">
            {loading ? '—' : kpis.totalInativos}
          </p>
          <p className="text-xs text-slate-400 mt-1">Fora dos novos registros</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Sem estoque mínimo</p>
          <p className="text-2xl font-bold text-[#C86D2D] mt-1.5 sm:mt-2">
            {loading
              ? '—'
              : `${kpis.semEstoqueMinimo} ${
                  kpis.semEstoqueMinimo === 1 ? 'item' : 'itens'
                }`}
          </p>
          <p className="text-xs text-slate-400 mt-1">Complete o cadastro</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Custo médio</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 sm:mt-2">
            {loading ? '—' : formatBRL(kpis.custoMedio)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Por unidade cadastrada</p>
        </div>
      </div>

      {/* Catálogo de Insumos */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 md:border-b-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Catálogo de insumos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preços usados no cálculo automático das perdas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar insumo..."
                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-800"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-800 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'Todas' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 px-4 text-center text-sm text-slate-500">
            Carregando insumos...
          </div>
        ) : filteredInsumos.length === 0 ? (
          <div className="py-10 px-4 text-center text-sm text-slate-500">
            Nenhum insumo encontrado.
          </div>
        ) : (
          <>
            {/* MOBILE: Cards empilhados (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredInsumos.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-500 shrink-0">
                        <BoxIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.nome}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.categoria} · por {item.unidade}
                        </p>
                      </div>
                    </div>

                    {item.ativo ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F3EC] text-[#145338] shrink-0">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 shrink-0">
                        Inativo
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-lg p-2.5 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">
                        Preço
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatBRL(item.preco)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">
                        Est. mínimo
                      </span>
                      <span className="text-slate-700">
                        {item.estoqueMinimo != null
                          ? formatQuantity(item.estoqueMinimo, item.unidade)
                          : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">
                        Perda mês
                      </span>
                      <span className="text-slate-700">
                        {formatQuantity(item.perdaMes, item.unidade)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs font-semibold text-brand-800 hover:underline py-1 cursor-pointer"
                    >
                      Editar insumo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP / TABLET: Tabela completa (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                    <th className="py-3 px-5">Insumo</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Preço</th>
                    <th className="py-3 px-4">Estoque mínimo</th>
                    <th className="py-3 px-4">Perda no mês</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm whitespace-nowrap">
                  {filteredInsumos.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-500 shrink-0">
                            <BoxIcon />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.nome}
                            </p>
                            <p className="text-xs text-slate-400">
                              por {item.unidade}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {item.categoria}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {formatBRL(item.preco)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {item.estoqueMinimo != null
                          ? formatQuantity(item.estoqueMinimo, item.unidade)
                          : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {formatQuantity(item.perdaMes, item.unidade)}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.ativo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F3EC] text-[#145338]">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            Inativo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="text-xs font-semibold text-brand-800 hover:underline cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      <InsumoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInsumo}
        initialData={editingInsumo}
      />
    </div>
  );
}

function BoxIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}