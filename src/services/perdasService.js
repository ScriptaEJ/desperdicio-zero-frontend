const API_URL = import.meta.env.VITE_API_URL ?? '';
const BASE = `${API_URL}/perdas`;

async function request(url, init) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Erro ${res.status} ao acessar /perdas`);
  }
  return res.status === 204 ? undefined : res.json();
}

export const perdasService = {
  listar: () => request(BASE),
  criar: (dados) => request(BASE, { method: 'POST', body: JSON.stringify(dados) }),
};