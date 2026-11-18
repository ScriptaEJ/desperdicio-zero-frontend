import { dataRotulo, moeda, quantidadeFmt, turnoDe } from '../../utils/format';
import { Avatar } from './Avatar';
import { MotivoBadge } from './MotivoBadge';

const th =
  'border-y border-[#e3e9e5] bg-[#f6f8f6] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7c73]';
const td = 'border-b border-[#e3e9e5] px-5 py-4 group-last:border-b-0';

export function PerdasTabela({ perdas, carregando, erro, onTentarNovamente }) {
  if (erro) {
    return (
      <div className="px-5 py-12 text-center text-[#6b7c73]">
        <p>{erro}</p>
        <button onClick={onTentarNovamente} className="mt-2 font-semibold text-[#14573f] underline">
          Tentar novamente
        </button>
      </div>
    );
  }
  if (carregando) return <div className="px-5 py-12 text-center text-[#6b7c73]">Carregando perdas...</div>;
  if (!perdas.length)
    return (
      <div className="px-5 py-12 text-center text-[#6b7c73]">
        Nenhuma perda encontrada. Use “Nova perda” para registrar.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px] text-[#12261d]">
        <thead>
          <tr>
            {['Insumo', 'Tipo', 'Motivo', 'Quantidade', 'Custo perdido', 'Data e turno', 'Responsável'].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {perdas.map((p) => (
            <tr key={p.id} className="group">
              <td className={`${td} font-bold`}>{p.insumo}</td>
              <td className={td}>{p.tipo}</td>
              <td className={td}><MotivoBadge motivo={p.motivo} /></td>
              <td className={td}>{quantidadeFmt(p.quantidade, p.unidade)}</td>
              <td className={`${td} font-bold text-[#c0392b]`}>{moeda(p.custo)}</td>
              <td className={td}>
                <div className="font-medium">{dataRotulo(p.dataHora)}</div>
                <div className="mt-0.5 text-[11.5px] text-[#6b7c73]">{turnoDe(p)}</div>
              </td>
              <td className={td}><Avatar nome={p.responsavel} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}