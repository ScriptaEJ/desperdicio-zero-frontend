import api from './api';
import { extrairErroApi, listarInsumos } from './insumosService';

export const TIPOS_PERDA = [
  { value: 'insumo', label: 'Insumo' },
  { value: 'sobra_buffet', label: 'Sobra de buffet' },
  { value: 'sobra_prato', label: 'Sobra de prato' },
];

export const MOTIVOS_PERDA = [
  { value: 'vencimento', label: 'Vencimento' },
  { value: 'sobra', label: 'Sobrou' },
  { value: 'erro_preparo', label: 'Erro de preparo' },
  { value: 'quebra', label: 'Quebra' },
  { value: 'devolucao', label: 'Devolução' },
];

export const TURNOS_PERDA = [
  { value: '', label: 'Não informado' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
];

export const UNIDADES_PERDA = ['kg', 'g', 'L', 'ml', 'unidade'];

const TIPO_LABELS = Object.fromEntries(TIPOS_PERDA.map((t) => [t.value, t.label]));
const MOTIVO_LABELS = Object.fromEntries(MOTIVOS_PERDA.map((m) => [m.value, m.label]));
const TURNO_LABELS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

const usuariosCache = new Map();

async function resolverNomeUsuario(usuarioId) {
  if (!usuarioId) return 'Equipe';
  if (usuariosCache.has(usuarioId)) return usuariosCache.get(usuarioId);

  try {
    const { data } = await api.get(`/user/${usuarioId}`);
    const nome = data?.nome || `Usuário #${usuarioId}`;
    usuariosCache.set(usuarioId, nome);
    return nome;
  } catch {
    const fallback = `Usuário #${usuarioId}`;
    usuariosCache.set(usuarioId, fallback);
    return fallback;
  }
}

function mapFromApi(item, insumosMap, usuariosMap) {
  const insumoObj = item.insumo_id ? insumosMap.get(item.insumo_id) : null;
  const tipoLabel = TIPO_LABELS[item.tipo_registro] || item.tipo_registro;

  return {
    id: item.id,
    restauranteId: item.restaurante_id,
    insumoId: item.insumo_id,
    insumo: insumoObj?.nome || `${tipoLabel} #${item.id}`,
    tipo: tipoLabel,
    motivo: MOTIVO_LABELS[item.motivo] || item.motivo,
    quantidade: Number(item.quantidade ?? 0),
    unidade: item.unidade_medida,
    custoUnitario: Number(item.custo_unitario ?? 0),
    custo: Number(
      item.valor_total ??
        Number(item.quantidade ?? 0) * Number(item.custo_unitario ?? 0)
    ),
    dataHora: item.data_perda,
    turno: item.turno ? TURNO_LABELS[item.turno] || item.turno : null,
    observacao: item.observacao || '',
    responsavel: usuariosMap.get(item.usuario_id) || `Usuário #${item.usuario_id}`,
  };
}

export const perdasService = {
  async listar() {
    try {
      const [{ data }, insumos] = await Promise.all([
        api.get('/perdas', { params: { page: 1, size: 100 } }),
        listarInsumos().catch(() => []),
      ]);

      const items = Array.isArray(data) ? data : data?.items ?? [];
      const insumosMap = new Map(insumos.map((i) => [i.id, i]));

      const usuarioIds = [...new Set(items.map((i) => i.usuario_id).filter(Boolean))];
      await Promise.all(usuarioIds.map((id) => resolverNomeUsuario(id)));

      return items.map((item) => mapFromApi(item, insumosMap, usuariosCache));
    } catch (err) {
      throw new Error(extrairErroApi(err, 'Não foi possível carregar as perdas.'));
    }
  },

  async criar(payload) {
    try {
      const { data } = await api.post('/perdas', payload);
      return data;
    } catch (err) {
      throw new Error(extrairErroApi(err, 'Não foi possível registrar a perda.'));
    }
  },

  async excluir(id) {
    try {
      await api.delete(`/perdas/${id}`);
    } catch (err) {
      throw new Error(extrairErroApi(err, 'Não foi possível excluir o registro.'));
    }
  },
};