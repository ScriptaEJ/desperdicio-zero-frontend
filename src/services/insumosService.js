// src/services/insumosService.js
import api from './api';

export const CATEGORIAS_INSUMOS = [
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'laticinio', label: 'Laticínio' },
  { value: 'proteinas', label: 'Proteínas' },
  { value: 'mercearia', label: 'Mercearia' },
  { value: 'bebidas', label: 'Bebidas' },
];

export const CATEGORIA_LABELS = Object.fromEntries(
  CATEGORIAS_INSUMOS.map((c) => [c.value, c.label])
);

export const UNIDADES_MEDIDA = ['kg', 'g', 'L', 'ml', 'unidade'];

async function resolverRestauranteId() {
  const saved = localStorage.getItem('restaurante_id');
  if (saved) return Number(saved);

  try {
    const { data } = await api.get('/restaurantes/');
    const lista = Array.isArray(data)
      ? data
      : data?.items ?? data?.data ?? data?.results ?? [];

    if (lista.length > 0 && lista[0]?.id) {
      localStorage.setItem('restaurante_id', String(lista[0].id));
      return Number(lista[0].id);
    }
  } catch {
    // Se falhar, usa 1 como fallback
  }

  return 1;
}

// Converte InsumoResponse (FastAPI) -> formato usado nos componentes React
function mapFromApi(item) {
  return {
    id: item.id,
    restauranteId: item.restaurante_id,
    nome: item.nome,
    categoria: item.categoria,
    unidade: item.unidade_medida,
    preco: Number(item.custo_unitario ?? 0),
    estoqueMinimo:
      item.estoque_minimo != null ? Number(item.estoque_minimo) : null,
    perdaMes: item.perda_mes != null ? Number(item.perda_mes) : 0,
    ativo: item.ativo ?? true,
  };
}

// Converte dados do modal -> schema CreateInsumo
function mapToCreateApi(data, restauranteId) {
  return {
    restaurante_id: data.restauranteId ?? restauranteId,
    nome: data.nome,
    categoria: data.categoria,
    unidade_medida: data.unidade,
    custo_unitario: data.preco,
    estoque_minimo: data.estoqueMinimo,
  };
}

// Converte dados do modal -> schema UpdateInsumo
function mapToUpdateApi(data) {
  return {
    nome: data.nome,
    categoria: data.categoria,
    unidade_medida: data.unidade,
    custo_unitario: data.preco,
    estoque_minimo: data.estoqueMinimo,
    ativo: data.ativo,
  };
}

export function extrairErroApi(err, fallback = 'Erro ao comunicar com o servidor.') {
  const status = err?.response?.status;
  if (status === 401) {
    return 'Sessão expirada ou não autenticada. Faça login novamente.';
  }
  if (status === 403) {
    return 'Acesso negado: apenas usuários com perfil admin podem gerenciar insumos.';
  }

  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((e) => {
        const campo = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : '';
        return campo ? `${campo}: ${e.msg}` : e.msg;
      })
      .join(' | ');
  }
  return fallback;
}

export async function listarInsumos() {
  try {
    const restauranteId = await resolverRestauranteId();
    const { data } = await api.get('/insumos', {
      params: { restaurante_id: restauranteId },
    });
    return Array.isArray(data) ? data.map(mapFromApi) : [];
  } catch (err) {
    // O FastAPI retorna 404 quando o restaurante ainda não tem nenhum insumo cadastrado
    if (err?.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function criarInsumo(insumoData) {
  const restauranteId = await resolverRestauranteId();
  const { data } = await api.post(
    '/insumos',
    mapToCreateApi(insumoData, restauranteId)
  );

  if (insumoData.ativo === false && data?.id) {
    return atualizarInsumo(data.id, { ...insumoData, ativo: false });
  }

  return mapFromApi(data);
}

export async function atualizarInsumo(id, insumoData) {
  const { data } = await api.patch(`/insumos/${id}`, mapToUpdateApi(insumoData));
  return mapFromApi(data);
}