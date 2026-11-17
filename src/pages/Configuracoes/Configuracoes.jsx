import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfiguracoesPage() {
  const navigate = useNavigate();

  // Dados do restaurante
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('Casa da Vila');
  const [cwid, setCwid] = useState('CDV-SP-01');
  const [custoMedioKg, setCustoMedioKg] = useState('14,82');

  // Usuário responsável
  const [nomeUsuario, setNomeUsuario] = useState('Marina Costa');
  const [emailUsuario, setEmailUsuario] = useState('marina@casadavila.com.br');
  const [perfilUsuario, setPerfilUsuario] = useState('Usuário');
  const [usuarioAtivo, setUsuarioAtivo] = useState(true);

  // Alertas e notificações
  const [alertas, setAlertas] = useState({
    itemCritico: true,
    estoqueMinimo: true,
    resumoDiario: false,
    relatorioSemanal: true,
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  const toggleAlerta = (key) => {
    setAlertas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      restaurante: {
        nome: nomeEstabelecimento.trim(),
        cwid: cwid.trim(),
        custo_medio_kg: parseFloat(String(custoMedioKg).replace(',', '.')) || 0,
      },
      usuario: {
        nome: nomeUsuario.trim(),
        email: emailUsuario.trim(),
        perfil: perfilUsuario,
        ativo: usuarioAtivo,
      },
      notificacoes: {
        alerta_item_critico: alertas.itemCritico,
        estoque_abaixo_minimo: alertas.estoqueMinimo,
        resumo_diario: alertas.resumoDiario,
        relatorio_semanal: alertas.relatorioSemanal,
      },
    };

    console.log('Configurações prontas para o FastAPI:', payload);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleLogout = () => {
    // Limpe o token de autenticação aqui quando integrar com o backend
    navigate('/login');
  };

  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';
  const inputClass =
    'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-800 bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Cabeçalho da Página */}
      <div>
        <span className="text-xs font-medium text-brand-800">Administração</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
          Configurações
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Personalize os dados do restaurante, metas e notificações.
        </p>
      </div>

      {/* Linha Superior: Dados do restaurante (7 cols) + Usuário responsável (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Card 1: Dados do restaurante */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Dados do restaurante</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Campos vinculados ao cadastro do estabelecimento
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={labelClass}>Nome do estabelecimento</label>
                <input
                  type="text"
                  required
                  value={nomeEstabelecimento}
                  onChange={(e) => setNomeEstabelecimento(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={labelClass}>CWID</label>
                  <input
                    type="text"
                    value={cwid}
                    onChange={(e) => setCwid(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Custo médio por kg</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={custoMedioKg}
                    onChange={(e) => setCustoMedioKg(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Usuário responsável */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Usuário responsável</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Perfil vinculado a este restaurante
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input
                  type="text"
                  required
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input
                    type="email"
                    required
                    value={emailUsuario}
                    onChange={(e) => setEmailUsuario(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Perfil</label>
                  <div className="relative">
                    <select
                      value={perfilUsuario}
                      onChange={(e) => setPerfilUsuario(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-9 text-sm text-slate-800 focus:outline-none focus:border-brand-800 cursor-pointer"
                    >
                      <option value="Usuário">Usuário</option>
                      <option value="Administradora">Administradora</option>
                      <option value="Gerente">Gerente</option>
                    </select>
                    <svg
                      className="w-4 h-4 text-slate-600 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Checkbox Usuário ativo */}
              <label className="flex items-center gap-3 bg-[#F3F5F4] rounded-xl px-4 py-3 cursor-pointer select-none">
                <CheckboxBox
                  checked={usuarioAtivo}
                  onChange={() => setUsuarioAtivo((prev) => !prev)}
                />
                <span className="text-xs font-medium text-slate-700">Usuário ativo</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Linha Inferior: Alertas e notificações */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Alertas e notificações</h2>
          <p className="text-xs text-slate-400 mt-0.5">Escolha quando deseja ser avisado</p>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {/* Item 1 */}
          <NotificationRow
            title="Alerta de item crítico"
            description="Ao superar 25% do custo semanal"
            checked={alertas.itemCritico}
            onChange={() => toggleAlerta('itemCritico')}
            hasBottomBorder
          />

          {/* Item 2 */}
          <NotificationRow
            title="Estoque abaixo do mínimo"
            description="Avisar sobre necessidade de reposição"
            checked={alertas.estoqueMinimo}
            onChange={() => toggleAlerta('estoqueMinimo')}
            hasBottomBorder
          />

          {/* Item 3 */}
          <NotificationRow
            title="Resumo diário"
            description="Enviar resultado ao fim do expediente"
            checked={alertas.resumoDiario}
            onChange={() => toggleAlerta('resumoDiario')}
            hasBottomBorderMobile
          />

          {/* Item 4 */}
          <NotificationRow
            title="Relatório semanal"
            description="Enviar aos domingos às 20h"
            checked={alertas.relatorioSemanal}
            onChange={() => toggleAlerta('relatorioSemanal')}
          />
        </div>
      </section>

      {/* Rodapé de Ações */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl border border-[#E7C6C2] bg-white hover:bg-red-50/60 text-xs sm:text-sm font-semibold text-[#B5473C] text-center transition-colors cursor-pointer"
        >
          Sair da conta
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-brand-800 hover:opacity-95 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-opacity cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{savedFeedback ? 'Alterações salvas!' : 'Salvar alterações'}</span>
        </button>
      </div>
    </form>
  );
}

function NotificationRow({
  title,
  description,
  checked,
  onChange,
  hasBottomBorder = false,
  hasBottomBorderMobile = false,
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4 py-3.5 cursor-pointer select-none ${
        hasBottomBorder
          ? 'border-b border-slate-100'
          : hasBottomBorderMobile
          ? 'border-b border-slate-100 md:border-b-0'
          : ''
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>

      <CheckboxBox checked={checked} onChange={onChange} />
    </label>
  );
}

function CheckboxBox({ checked, onChange }) {
  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <span className="w-4 h-4 rounded-[4px] border border-slate-300 bg-white peer-checked:bg-brand-800 peer-checked:border-brand-800 flex items-center justify-center text-white transition-colors shrink-0">
        {checked && (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </>
  );
}