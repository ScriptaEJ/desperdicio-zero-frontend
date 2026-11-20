import api from './api.js';

export async function loginRequest(email, senha) {
  const { data } = await api.post('/login', { email, senha });

  const token =
    typeof data === 'string'
      ? data
      : data?.access_token || data?.acess_token || data?.token;

  if (!token) {
    throw new Error('Token não retornado pela API.');
  }

  localStorage.setItem('acess_token', token);
  localStorage.setItem('access_token', token);

  let restauranteId =
    data?.restaurante_id ?? data?.user?.restaurante_id ?? data?.usuario?.restaurante_id;

  if (!restauranteId && token.split('.').length === 3) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      restauranteId = payload?.restaurante_id;
    } catch {
      // Ignora caso o token não seja um JWT padrão
    }
  }

  if (restauranteId) {
    localStorage.setItem('restaurante_id', String(restauranteId));
  }

  return data;
}

export function logout() {
  localStorage.removeItem('acess_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('restaurante_id');
}

export function isAuthenticated() {
  const token =
    localStorage.getItem('acess_token') || localStorage.getItem('access_token');

  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) {
    logout();
    return false;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch {
    logout();
    return false;
  }
}