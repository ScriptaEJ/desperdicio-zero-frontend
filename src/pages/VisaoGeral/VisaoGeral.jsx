import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { perdasService } from '../../services/perdasService';
import { turnoDe } from '../../utils/format';

const RANKING_COLORS = [
  'bg-[#F59E0B]',
  'bg-[#EF5350]',
  'bg-[#38A169]',
  'bg-[#7C9A7E]',
  'bg-[#D6D6D2]',
];

const DIAS_LABEL = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const DIAS_COMPLETOS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

const TURNO_EXTENSO = {
  Manhã: 'de manhã',
  Tarde: 'à tarde',
  Noite: 'à noite',
};

const formatBRL = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

function resolverNomeUsuarioLogado(propName) {
  if (propName) return propName;

  const savedName =
    localStorage.getItem('user_name') || localStorage.getItem('nome');
  if (savedName) return savedName.split(' ')[0];

  try {
    const token =
      localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.nome) return String(payload.nome).split(' ')[0];
      if (payload?.sub && String(payload.sub).includes('@')) {
        const prefixo = String(payload.sub).split('@')[0];
        return prefixo.charAt(0).toUpperCase() + prefixo.slice(1);
      }
    }
  } catch {
    // Ignora falha ao decodificar token
  }

  return 'Gestor';
}

function obterIntervalosPeriodo(periodo) {
  const agora = new Date();
  const hojeInicio = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate()
  );

  // Segunda-feira da semana atual (00:00:00)
  const diaSemana = hojeInicio.getDay(); // 0 = Dom, 1 = Seg ... 6 = Sáb
  const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  const inicioSemanaAtual = new Date(hojeInicio);
  inicioSemanaAtual.setDate(hojeInicio.getDate() + diffSegunda);

  if (periodo === 'Semana passada') {
    const inicio = new Date(inicioSemanaAtual);
    inicio.setDate(inicio.getDate() - 7);

    const fim = new Date(inicioSemanaAtual);
    fim.setMilliseconds(-1);

    const anteriorInicio = new Date(inicio);
    anteriorInicio.setDate(anteriorInicio.getDate() - 7);

    const anteriorFim = new Date(inicio);
    anteriorFim.setMilliseconds(-1);

    return { inicio, fim, anteriorInicio, anteriorFim, diasDivisor: 7 };
  }

  if (periodo === 'Este mês') {
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fim = new Date(
      agora.getFullYear(),
      agora.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const anteriorInicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const anteriorFim = new Date(inicio);
    anteriorFim.setMilliseconds(-1);

    const diasDivisor = Math.max(1, agora.getDate());
    return { inicio, fim, anteriorInicio, anteriorFim, diasDivisor };
  }

  // 'Esta semana' (padrão)
  const fim = new Date(inicioSemanaAtual);
  fim.setDate(fim.getDate() + 6);
  fim.setHours(23, 59, 59, 999);

  const anteriorInicio = new Date(inicioSemanaAtual);
  anteriorInicio.setDate(anteriorInicio.getDate() - 7);

  const anteriorFim = new Date(inicioSemanaAtual);
  anteriorFim.setMilliseconds(-1);

  const diasDecorridos = diaSemana === 0 ? 7 : diaSemana;
  return {
    inicio: inicioSemanaAtual,
    fim,
    anteriorInicio,
    anteriorFim,
    diasDivisor: Math.max(1, diasDecorridos),
  };
}

function formatarIntervaloTexto(inicio, fim) {
  const diaIni = String(inicio.getDate()).padStart(2, '0');
  const diaFim = String(fim.getDate()).padStart(2, '0');
  const mesFim = fim.toLocaleDateString('pt-BR', { month: 'long' });

  if (inicio.getMonth() === fim.getMonth()) {
    return `${diaIni} a ${diaFim} de ${mesFim}`;
  }
  const mesIni = inicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `${diaIni} de ${mesIni} a ${diaFim} de ${mesFim}`;
}

function converterParaKg(quantidade, unidade) {
  const qtd = Number(quantidade || 0);
  if (unidade === 'kg') return qtd;
  if (unidade === 'g') return qtd / 1000;
  return 0;
}

function gerarSugestaoPorMotivo(nomeItem, motivoDominante, custoItem, diasDivisor) {
  const itemLower = nomeItem.toLowerCase();
  const economiaMensal = Math.max(10, Math.round((custoItem / diasDivisor) * 30 * 0.25));
  const economiaFmt = `${formatBRL(economiaMensal)}/mês`;

  if (motivoDominante === 'Vencimento') {
    return {
      titulo: `Ajuste a compra de ${itemLower}`,
      textoAntes: 'Reduza o pedido semanal em ',
      destaque1: '10%',
      textoMeio: ' e priorize a rotação PVPS (primeiro que vence, primeiro que sai). Economia estimada de ',
      economia: economiaFmt,
    };
  }

  if (motivoDominante === 'Sobrou') {
    return {
      titulo: `Reduza o porcionamento de ${itemLower}`,
      textoAntes: 'Ajuste a produção diária em ',
      destaque1: '8%',
      textoMeio: ' nos turnos de menor movimento e controle as porções. Economia estimada de ',
      economia: economiaFmt,
    };
  }

  if (motivoDominante === 'Erro de preparo') {
    return {
      titulo: `Padronize o preparo de ${itemLower}`,
      textoAntes: 'Revise a ficha técnica e o porcionamento prévio para cortar falhas em ',
      destaque1: '15%',
      textoMeio: '. Economia estimada de ',
      economia: economiaFmt,
    };
  }

  return {
    titulo: `Revise o controle de ${itemLower}`,
    textoAntes: 'Reforce a conferência de armazenamento e manuseio para reduzir perdas em ',
    destaque1: '10%',
    textoMeio: '. Economia estimada de ',
    economia: economiaFmt,
  };
}

export default function VisaoGeralPage({ userName }) {
  const [todasPerdas, setTodasPerdas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [periodo, setPeriodo] = useState('Esta semana');
  const [turno, setTurno] = useState('Todos os turnos');
  const [downloading, setDownloading] = useState(false);

  const nomeExibicao = useMemo(
    () => resolverNomeUsuarioLogado(userName),
    [userName]
  );

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const lista = await perdasService.listar();
      setTodasPerdas(lista);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os indicadores.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const data = useMemo(() => {
    const { inicio, fim, anteriorInicio, anteriorFim, diasDivisor } =
      obterIntervalosPeriodo(periodo);

    const filtraTurno = (p) =>
      turno === 'Todos os turnos' || turnoDe(p) === turno;

    const atuais = todasPerdas.filter((p) => {
      const dt = new Date(p.dataHora);
      return dt >= inicio && dt <= fim && filtraTurno(p);
    });

    const anteriores = todasPerdas.filter((p) => {
      const dt = new Date(p.dataHora);
      return dt >= anteriorInicio && dt <= anteriorFim && filtraTurno(p);
    });

    // KPI 1: Custo perdido + comparativo
    const custoPerdido = atuais.reduce((acc, p) => acc + Number(p.custo || 0), 0);
    const custoAnterior = anteriores.reduce(
      (acc, p) => acc + Number(p.custo || 0),
      0
    );

    let comparativoCusto = 'Sem registros no período anterior';
    if (custoAnterior > 0) {
      const variacao = ((custoPerdido - custoAnterior) / custoAnterior) * 100;
      const pctFmt = Math.abs(variacao).toFixed(1).replace('.', ',');
      comparativoCusto =
        variacao <= 0
          ? `${pctFmt}% menor que o período anterior`
          : `${pctFmt}% maior que o período anterior`;
    } else if (custoPerdido > 0) {
      comparativoCusto = 'Primeiro período com perdas registradas';
    }

    // KPI 2: Itens descartados em kg + comparativo
    const itensDescartados = Number(
      atuais
        .reduce((acc, p) => acc + converterParaKg(p.quantidade, p.unidade), 0)
        .toFixed(1)
    );
    const itensAnteriores = anteriores.reduce(
      (acc, p) => acc + converterParaKg(p.quantidade, p.unidade),
      0
    );

    let comparativoItens = 'Sem volume no período anterior';
    if (itensAnteriores > 0 || itensDescartados > 0) {
      const diffKg = itensDescartados - itensAnteriores;
      const diffFmt = Math.abs(diffKg).toFixed(1).replace('.', ',');
      if (Math.abs(diffKg) < 0.05) {
        comparativoItens = 'Mesmo volume do período anterior';
      } else {
        comparativoItens =
          diffKg < 0
            ? `${diffFmt} kg a menos no período`
            : `${diffFmt} kg a mais no período`;
      }
    }

    // KPI 3: Registros de perda + média diária
    const registrosPerda = atuais.length;
    const mediaDia = (registrosPerda / diasDivisor).toFixed(1).replace('.', ',');
    const mediaRegistros = `Média de ${mediaDia} registros por dia`;

    // Ranking por item (Top 4 + Outros)
    const mapaItens = new Map();
    atuais.forEach((p) => {
      const chave = p.insumo || 'Item sem nome';
      const atual = mapaItens.get(chave) || {
        nome: chave,
        valor: 0,
        kg: 0,
        qtdBruta: 0,
        unidade: p.unidade,
        motivos: new Map(),
      };
      atual.valor += Number(p.custo || 0);
      atual.kg += converterParaKg(p.quantidade, p.unidade);
      atual.qtdBruta += Number(p.quantidade || 0);
      atual.motivos.set(
        p.motivo,
        (atual.motivos.get(p.motivo) || 0) + Number(p.custo || 0)
      );
      mapaItens.set(chave, atual);
    });

    const itensOrdenados = [...mapaItens.values()].sort(
      (a, b) => b.valor - a.valor
    );
    const top4 = itensOrdenados.slice(0, 4);
    const restantes = itensOrdenados.slice(4);

    if (restantes.length > 0) {
      const somaOutros = restantes.reduce((acc, i) => acc + i.valor, 0);
      top4.push({
        nome: 'Outros itens',
        valor: somaOutros,
        kg: 0,
        qtdBruta: 0,
        unidade: '',
        motivos: new Map(),
      });
    }

    const maxRankingValor = Math.max(...top4.map((i) => i.valor), 0);
    const ranking = top4.map((item, idx) => ({
      id: `${item.nome}-${idx}`,
      nome: item.nome,
      valor: item.valor,
      percentual:
        custoPerdido > 0 ? Math.round((item.valor / custoPerdido) * 100) : 0,
      barWidth:
        maxRankingValor > 0
          ? Math.max(8, Math.round((item.valor / maxRankingValor) * 100))
          : 0,
      color: RANKING_COLORS[idx] || RANKING_COLORS[RANKING_COLORS.length - 1],
    }));

    // Por dia da semana (Seg=0 ... Dom=6)
    const totaisPorDia = [0, 0, 0, 0, 0, 0, 0];
    const mapaDiaTurno = new Map();

    atuais.forEach((p) => {
      const dt = new Date(p.dataHora);
      const idxSeg = dt.getDay() === 0 ? 6 : dt.getDay() - 1;
      const custo = Number(p.custo || 0);
      totaisPorDia[idxSeg] += custo;

      const t = turnoDe(p);
      const chaveDT = `${idxSeg}-${t}`;
      mapaDiaTurno.set(chaveDT, (mapaDiaTurno.get(chaveDT) || 0) + custo);
    });

    const maxDiaValor = Math.max(...totaisPorDia, 0);
    const diasSemana = DIAS_LABEL.map((dia, idx) => {
      const valor = Math.round(totaisPorDia[idx]);
      return {
        dia,
        valor,
        heightPct:
          maxDiaValor > 0
            ? Math.max(10, Math.round((totaisPorDia[idx] / maxDiaValor) * 100))
            : 8,
        destaque: maxDiaValor > 0 && totaisPorDia[idx] === maxDiaValor,
      };
    });

    // Maior desperdício (Dia + Turno)
    let maiorDesperdicioTitulo = 'Sem registros no período';
    let maiorDesperdicioValor = 0;

    if (mapaDiaTurno.size > 0) {
      const [chaveTop, valorTop] = [...mapaDiaTurno.entries()].sort(
        (a, b) => b[1] - a[1]
      )[0];
      const [idxDiaStr, nomeTurno] = chaveTop.split('-');
      const diaNome = DIAS_COMPLETOS[Number(idxDiaStr)] || '';
      const sufixoTurno = TURNO_EXTENSO[nomeTurno] || '';
      maiorDesperdicioTitulo = `${diaNome} ${sufixoTurno}`.trim();
      maiorDesperdicioValor = Math.round(valorTop);
    }

    // Alerta + Sugestão inteligente baseados no item #1
    const lider = itensOrdenados[0] || null;
    let alertaItem = null;
    let alertaPercentual = '0%';
    let alertaDetalhes =
      'Registre os descartes diários para identificar automaticamente os maiores focos de perda.';
    let sugestao = {
      titulo: 'Mantenha os registros atualizados',
      textoAntes: 'Continue lançando as perdas por turno para descobrir oportunidades de reduzir custos em até ',
      destaque1: '15%',
      textoMeio: ' nas próximas semanas. Economia estimada após ',
      economia: '7 dias de histórico',
    };

    if (lider && custoPerdido > 0) {
      const pctLider = Math.round((lider.valor / custoPerdido) * 100);
      const motivosOrdenados = [...lider.motivos.entries()].sort(
        (a, b) => b[1] - a[1]
      );
      const motivoPrincipal = motivosOrdenados[0]?.[0] || 'descarte';

      const volumeTexto =
        lider.kg > 0
          ? `${lider.kg.toFixed(1).replace('.', ',')} kg`
          : `${lider.qtdBruta.toLocaleString('pt-BR')} ${lider.unidade}`;

      alertaItem = lider.nome;
      alertaPercentual = `${pctLider}%`;
      alertaDetalhes = `Foram ${volumeTexto} descartados no período, principalmente por ${motivoPrincipal.toLowerCase()}.`;

      sugestao = gerarSugestaoPorMotivo(
        lider.nome,
        motivoPrincipal,
        lider.valor,
        diasDivisor
      );
    }

    return {
      custoPerdido,
      comparativoCusto,
      itensDescartados,
      comparativoItens,
      registrosPerda,
      mediaRegistros,
      periodoRelatorio: formatarIntervaloTexto(inicio, fim),
      ranking,
      diasSemana,
      maiorDesperdicioTitulo,
      maiorDesperdicioValor,
      alertaItem,
      alertaPercentual,
      alertaDetalhes,
      sugestao,
    };
  }, [todasPerdas, periodo, turno]);

  const handleDownloadReport = () => {
    setDownloading(true);

    const linhas = [
      'Resumo - Desperdício Zero',
      `Período: ${periodo} (${data.periodoRelatorio}) | Turno: ${turno}`,
      `Custo perdido: ${formatBRL(data.custoPerdido)}`,
      `Itens descartados: ${data.itensDescartados.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg`,
      `Registros de perda: ${data.registrosPerda}`,
      '',
      'Ranking por item:',
      ...(data.ranking.length > 0
        ? data.ranking.map(
            (r, i) => `${i + 1}. ${r.nome} - ${formatBRL(r.valor)} (${r.percentual}%)`
          )
        : ['Nenhum registro no período selecionado.']),
    ];

    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-desperdicio-zero.txt';
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Cabeçalho + Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-brand-800">
            Olá, {nomeExibicao}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Visão geral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe os desperdícios e tome decisões mais inteligentes.
          </p>
        </div>

        {/* Dropdowns de Período e Turno */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              aria-label="Selecionar período"
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-brand-800 cursor-pointer"
            >
              <option value="Esta semana">Esta semana</option>
              <option value="Semana passada">Semana passada</option>
              <option value="Este mês">Este mês</option>
            </select>
            <ChevronDown />
          </div>

          <div className="relative">
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              aria-label="Selecionar turno"
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-brand-800 cursor-pointer"
            >
              <option value="Todos os turnos">Todos os turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Banner de Erro da API */}
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-xs sm:text-sm flex items-center justify-between gap-3">
          <span>{erro}</span>
          <button
            type="button"
            onClick={carregarDados}
            className="font-semibold underline shrink-0 cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Linha 1: 3 Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Custo perdido */}
        <div className="bg-white rounded-xl border border-slate-200/80 border-l-4 border-l-brand-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Custo perdido</p>
            <span className="w-7 h-7 rounded-lg bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {carregando ? '—' : formatBRL(data.custoPerdido)}
          </p>
          <p className="text-xs font-medium text-[#145338] mt-1.5">
            {carregando ? 'Calculando...' : data.comparativoCusto}
          </p>
        </div>

        {/* Card 2: Itens descartados */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Itens descartados</p>
            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold shrink-0">
              kg
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {carregando
              ? '—'
              : `${data.itensDescartados.toLocaleString('pt-BR', {
                  minimumFractionDigits: 1,
                })} kg`}
          </p>
          <p className="text-xs font-medium text-[#145338] mt-1.5">
            {carregando ? 'Calculando...' : data.comparativoItens}
          </p>
        </div>

        {/* Card 3: Registros de perda */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Registros de perda</p>
            <span className="w-7 h-7 rounded-lg bg-[#FEF3C7]/80 text-[#D97706] flex items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {carregando ? '—' : data.registrosPerda}
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            {carregando ? 'Calculando...' : data.mediaRegistros}
          </p>
        </div>
      </div>

      {/* Linha 2: Ranking por item + Gráfico Por dia da semana */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ranking por item */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ranking por item</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Itens que mais geraram custo no período selecionado
              </p>
            </div>

            <Link
              to="/perdas"
              className="text-xs font-semibold text-brand-800 hover:underline shrink-0"
            >
              Ver registros
            </Link>
          </div>

          {carregando ? (
            <div className="py-10 text-center text-xs text-slate-400">
              Carregando ranking...
            </div>
          ) : data.ranking.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              Nenhuma perda registrada neste período e turno.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {data.ranking.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2 sm:gap-3 text-xs sm:text-sm"
                >
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-medium text-slate-400 w-3 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">
                      {item.nome}
                    </span>
                  </div>

                  <div className="col-span-4 sm:col-span-5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                        style={{ width: `${item.barWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2 sm:gap-3 shrink-0">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {formatBRL(item.valor)}
                    </span>
                    <span className="text-xs text-slate-400 w-8 text-right tabular-nums hidden sm:inline">
                      {item.percentual}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Por dia da semana */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Por dia da semana</h2>
            <p className="text-xs text-slate-400 mt-0.5">Custo de desperdício em reais</p>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-40 pt-6 pb-2 px-1">
            {data.diasSemana.map((item) => (
              <div
                key={item.dia}
                className="flex flex-col items-center justify-end h-full group"
              >
                <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                  R${item.valor}
                </span>

                <div className="w-full max-w-[34px] flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      item.destaque
                        ? 'bg-[#E09F3E]'
                        : 'bg-[#76A88D] group-hover:bg-[#5E9477]'
                    }`}
                    style={{ height: `${item.heightPct}%` }}
                    title={`${item.dia}: ${formatBRL(item.valor)}`}
                  />
                </div>

                <span
                  className={`text-[11px] mt-2 ${
                    item.destaque ? 'font-bold text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {item.dia}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-[#FDF6EC] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[11px] text-slate-500">Maior desperdício</span>
              <span className="block text-sm font-bold text-slate-900 mt-0.5">
                {data.maiorDesperdicioTitulo}
              </span>
            </div>

            <span className="bg-white border border-amber-200/80 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 tabular-nums">
              R$ {data.maiorDesperdicioValor}
            </span>
          </div>
        </div>
      </div>

      {/* Linha 3: Alerta da Semana + Sugestão Inteligente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#14452F] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/75">
                Alerta do período
              </span>
            </div>

            <span className="bg-[#E9B949] text-[#143322] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0">
              {data.alertaItem ? 'Atenção' : 'Estável'}
            </span>
          </div>

          <div className="mt-5">
            {data.alertaItem ? (
              <h3 className="text-lg sm:text-[22px] font-bold leading-snug tracking-tight">
                {data.alertaItem} representou{' '}
                <span className="text-[#F4C150]">
                  {data.alertaPercentual} do desperdício
                </span>{' '}
                neste período.
              </h3>
            ) : (
              <h3 className="text-lg sm:text-[22px] font-bold leading-snug tracking-tight">
                Nenhuma perda crítica detectada neste período.
              </h3>
            )}
            <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
              {data.alertaDetalhes}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
                  <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.75c.64.54 1 1.33 1 2.17V17h6v-.08c0-.84.36-1.63 1-2.17A7 7 0 0 0 12 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <div>
                <span className="block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Sugestão inteligente
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {data.sugestao.titulo}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed">
              {data.sugestao.textoAntes}
              <strong className="font-semibold text-slate-800">
                {data.sugestao.destaque1}
              </strong>
              {data.sugestao.textoMeio}
              <strong className="font-semibold text-[#145338]">
                {data.sugestao.economia}
              </strong>
              .
            </p>
          </div>

          <div className="mt-4 pt-1">
            <Link
              to="/relatorios"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-800 hover:underline"
            >
              <span>Ver relatório completo</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Linha 4: Barra de Relatório Semanal Pronto */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="m9 15 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <div>
            <p className="text-sm font-bold text-slate-900">Relatório do período pronto</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Resumo para o proprietário • {data.periodoRelatorio}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </svg>
          <span>{downloading ? 'Relatório baixado!' : 'Baixar relatório'}</span>
        </button>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}