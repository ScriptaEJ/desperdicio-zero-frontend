import api from './api';

const AUTO_SEND_STORAGE_KEY = 'dz_relatorios_auto_send';

function formatarDataCurta(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });
}

function getPeriodoSemanalTexto() {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(fim.getDate() - 6);

  if (inicio.getMonth() === fim.getMonth()) {
    const d1 = String(inicio.getDate()).padStart(2, '0');
    const d2 = String(fim.getDate()).padStart(2, '0');
    const mes = fim.toLocaleDateString('pt-BR', { month: 'long' });
    return `${d1} a ${d2} de ${mes}`;
  }

  return `${formatarDataCurta(inicio)} a ${formatarDataCurta(fim)}`;
}

function getPeriodoMensalTexto() {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const d1 = String(inicio.getDate()).padStart(2, '0');
  const d2 = String(hoje.getDate()).padStart(2, '0');
  const mes = hoje.toLocaleDateString('pt-BR', { month: 'long' });
  return `${d1} a ${d2} de ${mes}`;
}

function resolverEmailUsuario() {
  const savedEmail = localStorage.getItem('user_email') || localStorage.getItem('email');
  if (savedEmail) return savedEmail;

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.sub && String(payload.sub).includes('@')) {
        return String(payload.sub);
      }
    }
  } catch {
    // Ignora falha ao decodificar JWT
  }

  return 'gestor@restaurante.com.br';
}

async function resolverRestauranteId() {
  const saved = localStorage.getItem('restaurante_id');
  if (saved) return Number(saved);

  try {
    const { data } = await api.get('/restaurantes/');
    const lista = Array.isArray(data)
      ? data
      : data?.items ?? data?.data ?? data?.results ?? [];

    if (lista.length > 0 && lista[0]?.id != null) {
      localStorage.setItem('restaurante_id', String(lista[0].id));
      return Number(lista[0].id);
    }
  } catch {
    // Fallback
  }

  return 1;
}

async function extrairErroBlob(err, fallback) {
  const data = err?.response?.data;

  if (data instanceof Blob) {
    try {
      const texto = await data.text();
      const json = JSON.parse(texto);
      if (typeof json?.detail === 'string') return json.detail;
      if (Array.isArray(json?.detail) && json.detail[0]?.msg) {
        return json.detail[0].msg;
      }
    } catch {
      // Se não for JSON, usa o fallback
    }
  }

  if (typeof data?.detail === 'string') return data.detail;
  return fallback;
}

function extrairNomeArquivo(headers, fallbackName) {
  const disposition = headers?.['content-disposition'] || '';
  const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)/i);
  if (match && match[1]) {
    return decodeURIComponent(match[1].replace(/"/g, '').trim());
  }
  return fallbackName;
}

export const CATALOGO_RELATORIOS = {
  featured: {
    id: 'executivo-semanal',
    endpoint: '/relatorios/executivo-semanal',
    title: 'Relatório executivo semanal',
    description:
      'Visão completa de custos, itens críticos e três recomendações práticas para reduzir o desperdício.',
    format: 'PDF',
  },
  reports: [
    {
      id: 'resumo-semanal',
      endpoint: '/relatorios/resumo-semanal',
      title: 'Resumo semanal',
      description: 'Custos, itens críticos e recomendações',
      format: 'PDF',
      getPeriod: getPeriodoSemanalTexto,
    },
    {
      id: 'desperdicio-por-insumo',
      endpoint: '/relatorios/desperdicio-por-insumo',
      title: 'Desperdício por insumo',
      description: 'Ranking completo por quantidade e custo',
      format: 'XLSX',
      getPeriod: getPeriodoMensalTexto,
    },
    {
      id: 'analise-turnos',
      endpoint: '/relatorios/analise-turnos',
      title: 'Análise de turnos',
      description: 'Comparativo entre manhã, tarde e noite',
      format: 'PDF',
      getPeriod: getPeriodoMensalTexto,
    },
    {
      id: 'historico-perdas',
      endpoint: '/relatorios/historico-perdas',
      title: 'Histórico de perdas',
      description: 'Todos os registros detalhados do período',
      format: 'CSV',
      getPeriod: getPeriodoMensalTexto,
    },
  ],
};

export async function getReportsData() {
  const email = resolverEmailUsuario();
  const savedAuto = localStorage.getItem(AUTO_SEND_STORAGE_KEY);
  const enabled = savedAuto !== null ? savedAuto === 'true' : true;

  return {
    featured: {
      ...CATALOGO_RELATORIOS.featured,
      period: getPeriodoSemanalTexto(),
    },
    reports: CATALOGO_RELATORIOS.reports.map(({ getPeriod, ...item }) => ({
      ...item,
      period: getPeriod(),
    })),
    autoSend: {
      enabled,
      schedule: 'Todo domingo às 20h',
      email,
    },
  };
}

export async function setAutoSend(enabled) {
  localStorage.setItem(AUTO_SEND_STORAGE_KEY, String(Boolean(enabled)));
  return {
    enabled: Boolean(enabled),
    schedule: 'Todo domingo às 20h',
    email: resolverEmailUsuario(),
  };
}

export async function downloadReport(report, filtros = {}) {
  try {
    const restauranteId = await resolverRestauranteId();
    const params = { restaurante_id: restauranteId };

    if (filtros.inicio) params.inicio = filtros.inicio;
    if (filtros.fim) params.fim = filtros.fim;

    const endpoint = report.endpoint || `/relatorios/${report.id}`;
    const response = await api.get(endpoint, {
      params,
      responseType: 'blob',
    });

    const extensao = (report.format || 'pdf').toLowerCase();
    const filename = extrairNomeArquivo(
      response.headers,
      `${report.id}.${extensao}`
    );

    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);

    return { simulated: false, filename };
  } catch (err) {
    const msg = await extrairErroBlob(
      err,
      `Não foi possível gerar o arquivo de ${report.title}.`
    );
    throw new Error(msg);
  }
}