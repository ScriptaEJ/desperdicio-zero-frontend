import { useState } from 'react';
import { MOTIVOS, TIPOS, UNIDADES } from '../../types/perda';

const inicial = {
  insumo: '',
  tipo: TIPOS[0],
  motivo: MOTIVOS[0],
  quantidade: '',
  unidade: UNIDADES[0],
  custo: '',
};

const label = 'flex flex-1 flex-col gap-1.5 text-[13px] font-semibold text-[#12261d]';
const campo =
  'rounded-[10px] border border-[#e3e9e5] px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#14573f]';

export function NovaPerdaModal({ aberto, onFechar, onSalvar }) {
  const [form, setForm] = useState(inicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  if (!aberto) return null;

  const set = (c) => (e) => setForm((f) => ({ ...f, [c]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await onSalvar({
        insumo: form.insumo.trim(),
        tipo: form.tipo,
        motivo: form.motivo,
        quantidade: Number(form.quantidade.replace(',', '.')),
        unidade: form.unidade,
        custo: Number(form.custo.replace(',', '.')),
      });
      setForm(inicial);
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar a perda.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#12261d]/45 p-4" onClick={onFechar}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={enviar}
        aria-label="Nova perda"
        className="flex w-full max-w-[520px] flex-col gap-4 rounded-[20px] bg-white p-7"
      >
        <h2 className="text-xl font-bold text-[#12261d]">Nova perda</h2>

        <label className={label}>
          Insumo
          <input required value={form.insumo} onChange={set('insumo')} placeholder="Ex.: Mussarela" className={campo} />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={label}>
            Tipo
            <select value={form.tipo} onChange={set('tipo')} className={campo}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className={label}>
            Motivo
            <select value={form.motivo} onChange={set('motivo')} className={campo}>
              {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={label}>
            Quantidade
            <input required inputMode="decimal" value={form.quantidade} onChange={set('quantidade')} className={campo} />
          </label>
          <label className={label}>
            Unidade
            <select value={form.unidade} onChange={set('unidade')} className={campo}>
              {UNIDADES.map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
          <label className={label}>
            Custo (R$)
            <input required inputMode="decimal" value={form.custo} onChange={set('custo')} className={campo} />
          </label>
        </div>

        {erro && <p className="text-[13px] text-[#c0392b]">{erro}</p>}

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-[10px] border border-[#e3e9e5] bg-white px-5 py-3 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-[10px] bg-[#14573f] px-5 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Salvar perda'}
          </button>
        </div>
      </form>
    </div>
  );
}