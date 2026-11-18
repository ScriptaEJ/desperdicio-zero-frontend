export const moeda = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const quantidadeFmt = (q, un) =>
  `${Number(q).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${un}`;

export const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

// Se o backend não enviar "turno", calcula pela hora
export function turnoDe(p) {
  if (p.turno) return p.turno;
  const h = new Date(p.dataHora).getHours();
  return h < 13 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite';
}

const mesmoDia = (a, b) => a.toDateString() === b.toDateString();

export function dataRotulo(iso) {
  const d = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (mesmoDia(d, hoje)) return `Hoje, ${hora}`;
  if (mesmoDia(d, ontem)) return `Ontem, ${hora}`;
  const dia = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  return `${dia}, ${hora}`;
}

export const ehHoje = (iso) => mesmoDia(new Date(iso), new Date());