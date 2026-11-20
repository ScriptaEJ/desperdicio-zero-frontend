// src/services/authService.js
import api from './api.js';

export async function loginRequest(email, senha) {
  const { data } = await api.post('/login', { email, senha });

  // Cobre tanto retorno em objeto ({ access_token: "..." }) quanto string pura
  const token =
    typeof data === 'string'
      ? data
      : data?.access_token || data?.acess_token || data?.token;

  if (!token) {
    throw new Error('Token não retornado pela API.');
  }

  // Salva nas duas chaves para manter compatibilidade com o api.js do time
  localStorage.setItem('acess_token', token);
  localStorage.setItem('access_token', token);

  // Se o login retornar o restaurante_id (no JSON ou dentro do payload do JWT), salva também
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