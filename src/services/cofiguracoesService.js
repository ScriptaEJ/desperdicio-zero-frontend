// src/services/configuracoesService.js
import api from './api';
import { extrairErroApi } from './insumosService';

const PREFS_STORAGE_KEY = 'dz_configuracoes_prefs';

const DEFAULT_ALERTAS = {
  itemCritico: true,
  estoqueMinimo: true,
  resumoDiario: false,
  relatorioSemanal: true,
};

function lerPreferenciasLocais() {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function salvarPreferenciasLocais(prefs) {
  const atual = lerPreferenciasLocais();
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...atual, ...prefs }));
}

function decodificarJwt() {
  try {
    const token =
      localStorage.getItem('acess_token') || localStorage.getItem('access_token');
    if (!token || token.split('.').length !== 3) return {};
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

async function buscarUsuarioAtual() {
  const payload = decodificarJwt();
  const userId = payload?.id ?? payload?.user_id;
  const emailToken = payload?.sub;

  if (userId) {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  }

  const { data } = await api.get('/users', { params: { page: 1, size: 100 } });
  const lista = Array.isArray(data) ? data : data?.items ?? [];

  if (emailToken) {
    const encontrado = lista.find(
      (u) => String(u.email).toLowerCase() === String(emailToken).toLowerCase()
    );
    if (encontrado) return encontrado;
  }

  return lista[0] || null;
}

async function buscarRestauranteAtual() {
  const savedId = localStorage.getItem('restaurante_id');

  if (savedId) {
    try {
      const { data } = await api.get(`/restaurantes/${savedId}`);
      if (data?.id != null) return data;
    } catch {
      // Se o ID salvo não existir mais, busca na listagem
    }
  }

  try {
    const { data } = await api.get('/restaurantes/', {
      params: { page: 1, size: 10 },
    });
    const lista = Array.isArray(data) ? data : data?.items ?? [];
    if (lista.length > 0 && lista[0]?.id != null) {
      localStorage.setItem('restaurante_id', String(lista[0].id));
      return lista[0];
    }
  } catch {
    // Ainda não há restaurante cadastrado
  }

  return null;
}

export async function carregarConfiguracoes() {
  try {
    const [usuario, restaurante] = await Promise.all([
      buscarUsuarioAtual(),
      buscarRestauranteAtual(),
    ]);

    const prefs = lerPreferenciasLocais();
    const custoRaw = restaurante?.custo_medio_kg ?? prefs.custoMedioKg ?? '';

    return {
      restauranteId: restaurante?.id ?? null,
      restauranteCamposApi: restaurante ? Object.keys(restaurante) : [],
      restaurante: {
        nome: restaurante?.nome || '',
        cwid: restaurante?.cwid ?? prefs.cwid ?? '',
        custoMedioKg:
          custoRaw !== '' && custoRaw != null
            ? String(custoRaw).replace('.', ',')
            : '',
      },
      usuarioId: usuario?.id ?? null,
      usuario: {
        nome: usuario?.nome || '',
        email: usuario?.email || decodificarJwt()?.sub || '',
        perfil: usuario?.perfil || 'user',
        ativo: usuario?.ativo ?? true,
      },
      alertas: {
        ...DEFAULT_ALERTAS,
        ...(prefs.alertas || {}),
      },
    };
  } catch (err) {
    throw new Error(
      extrairErroApi(err, 'Não foi possível carregar as configurações.')
    );
  }
}

export async function salvarConfiguracoes({
  restauranteId,
  restauranteCamposApi = [],
  restaurante,
  usuarioId,
  usuario,
  alertas,
}) {
  try {
    const custoNumerico = parseFloat(
      String(restaurante.custoMedioKg).replace(',', '.')
    );

    // 1. Atualiza o usuário no FastAPI (PATCH /user/{id})
    if (usuarioId) {
      await api.patch(`/user/${usuarioId}`, {
        nome: usuario.nome.trim(),
        email: usuario.email.trim(),
        perfil: usuario.perfil,
        ativo: Boolean(usuario.ativo),
      });
    }

    // 2. Atualiza (ou cria) o restaurante no FastAPI
    const payloadRestaurante = {
      nome: restaurante.nome.trim(),
    };

    if (
      restauranteCamposApi.includes('cwid') ||
      restauranteCamposApi.length === 0
    ) {
      if (restaurante.cwid.trim()) {
        payloadRestaurante.cwid = restaurante.cwid.trim();
      }
    }

    if (
      restauranteCamposApi.includes('custo_medio_kg') &&
      !Number.isNaN(custoNumerico)
    ) {
      payloadRestaurante.custo_medio_kg = custoNumerico;
    }

    let novoRestauranteId = restauranteId;

    if (restauranteId) {
      const { data } = await api.put(
        `/restaurantes/${restauranteId}`,
        payloadRestaurante
      );
      if (data?.id != null) novoRestauranteId = data.id;
    } else if (restaurante.nome.trim()) {
      const { data } = await api.post('/restaurantes/', payloadRestaurante);
      if (data?.id != null) {
        novoRestauranteId = data.id;
        localStorage.setItem('restaurante_id', String(data.id));
      }
    }

    // 3. Salva preferências complementares localmente
    salvarPreferenciasLocais({
      cwid: restaurante.cwid.trim(),
      custoMedioKg: restaurante.custoMedioKg.trim(),
      alertas,
    });

    return { restauranteId: novoRestauranteId };
  } catch (err) {
    throw new Error(
      extrairErroApi(err, 'Não foi possível salvar as configurações.')
    );
  }
}