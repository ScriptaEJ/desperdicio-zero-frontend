// src/components/RegisterLossModal/RegisterLossModal.jsx
import { useEffect, useMemo, useState } from 'react';

const INSUMOS_DISPONIVEIS = [
  { id: 1, nome: 'Mussarela', unidade: 'kg', preco: 26.38 },
  { id: 2, nome: 'Tomate italiano', unidade: 'kg', preco: 9.0 },
  { id: 3, nome: 'Filé de frango', unidade: 'kg', preco: 18.0 },
  { id: 4, nome: 'Arroz branco', unidade: 'kg', preco: 4.4 },
  { id: 5, nome: 'Azeite extravirgem', unidade: 'unidade', preco: 32.9 },
];

const MOTIVOS_PERDA = [
  'Vencimento / Validade',
  'Avaria ou queda',
  'Erro no preparo',
  'Armazenamento inadequado',
  'Sobra de produção',
  'Outro',
];

const TURNOS = ['Não informado', 'Manhã', 'Tarde', 'Noite'];
const UNIDADES = ['kg', 'g', 'L', 'ml', 'unidade'];

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function RegisterLossModal({ isOpen, onClose, onSave }) {
  const [tipoRegistro, setTipoRegistro] = useState('Insumo');
  const [insumoId, setInsumoId] = useState(INSUMOS_DISPONIVEIS[0].id);
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState(INSUMOS_DISPONIVEIS[0].unidade);
  const [custoUnitario, setCustoUnitario] = useState(
    INSUMOS_DISPONIVEIS[0].preco.toFixed(2).replace('.', ',')
  );
  const [motivo, setMotivo] = useState('');
  const [turno, setTurno] = useState('Não informado');
  const [dataPerda, setDataPerda] = useState(getCurrentDateTimeLocal);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDataPerda(getCurrentDateTimeLocal());
    }
  }, [isOpen]);

  const handleInsumoChange = (e) => {
    const selectedId = Number(e.target.value);
    setInsumoId(selectedId);

    const found = INSUMOS_DISPONIVEIS.find((item) => item.id === selectedId);
    if (found) {
      setUnidade(found.unidade);
      setCustoUnitario(found.preco.toFixed(2).replace('.', ','));
    }
  };

  const valorTotal = useMemo(() => {
    const qtd = parseFloat(String(quantidade).replace(',', '.')) || 0;
    const custo = parseFloat(String(custoUnitario).replace(',', '.')) || 0;
    return qtd * custo;
  }, [quantidade, custoUnitario]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      tipo_registro: tipoRegistro,
      insumo_id: insumoId,
      quantidade: parseFloat(String(quantidade).replace(',', '.')) || 0,
      unidade_medida: unidade,
      custo_unitario: parseFloat(String(custoUnitario).replace(',', '.')) || 0,
      valor_total: Number(valorTotal.toFixed(2)),
      motivo,
      turno,
      data_perda: dataPerda,
      observacao: observacao.trim() || null,
    };

    if (onSave) {
      onSave(payload);
    } else {
      console.log('Payload pronto para o FastAPI:', payload);
    }

    setQuantidade('');
    setMotivo('');
    setObservacao('');
    onClose();
  };

  const selectClass =
    'w-full appearance-none bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:border-brand-800 cursor-pointer';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-[540px] max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fixo */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 border-b border-slate-100 shrink-0">
          <div>
            <span className="block text-[11px] font-bold tracking-wider text-brand-800 uppercase">
              Novo registro
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Registrar perda
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informe o item e o motivo do descarte.
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
              <label className={labelClass}>Tipo de registro</label>
              <div className="relative">
                <select
                  value={tipoRegistro}
                  onChange={(e) => setTipoRegistro(e.target.value)}
                  className={selectClass}
                >
                  <option value="Insumo">Insumo</option>
                  <option value="Preparo">Preparo / Receita</option>
                  <option value="Produto pronto">Produto pronto</option>
                </select>
                <ChevronDown />
              </div>
            </div>

            <div>
              <label className={labelClass}>Insumo</label>
              <div className="relative">
                <select
                  value={insumoId}
                  onChange={handleInsumoChange}
                  className={selectClass}
                >
                  {INSUMOS_DISPONIVEIS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClass}>Quantidade</label>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="0,00"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-800"
                />
              </div>

              <div>
                <label className={labelClass}>Unidade de medida</label>
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
                <label className={labelClass}>Custo unitário</label>
                <div className="flex items-center border border-slate-200 rounded-lg px-3.5 py-2.5 focus-within:border-brand-800 bg-white">
                  <span className="text-xs font-medium text-slate-400 mr-2 select-none">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={custoUnitario}
                    onChange={(e) => setCustoUnitario(e.target.value)}
                    className="w-full text-sm text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Valor total</label>
                <div className="w-full rounded-lg px-3.5 py-2.5 bg-[#EEF4F0] text-sm font-bold text-brand-800">
                  {formatBRL(valorTotal)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClass}>Motivo</label>
                <div className="relative">
                  <select
                    required
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className={`${selectClass} ${!motivo ? 'text-slate-400' : 'text-slate-800'}`}
                  >
                    <option value="" disabled>
                      Selecione o motivo
                    </option>
                    {MOTIVOS_PERDA.map((m) => (
                      <option key={m} value={m} className="text-slate-800">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              <div>
                <label className={labelClass}>Turno</label>
                <div className="relative">
                  <select
                    value={turno}
                    onChange={(e) => setTurno(e.target.value)}
                    className={selectClass}
                  >
                    {TURNOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Data da perda</label>
              <input
                type="datetime-local"
                required
                value={dataPerda}
                onChange={(e) => setDataPerda(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-800"
              />
            </div>

            <div>
              <label className={labelClass}>Observação</label>
              <textarea
                rows={2}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Detalhes adicionais sobre a ocorrência (opcional)"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-800 resize-y"
              />
            </div>

            <div className="bg-[#F3F5F4] rounded-lg px-3.5 py-2.5 text-[11px] text-slate-500">
              O custo unitário foi preenchido com o valor atual do insumo e ficará registrado nesta perda.
            </div>
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
              className="bg-brand-800 hover:opacity-95 text-white text-sm font-medium px-5 py-2.5 rounded-lg text-center transition-opacity cursor-pointer"
            >
              Salvar registro
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
      className="w-4 h-4 text-brand-800 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}