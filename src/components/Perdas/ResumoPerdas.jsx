import { moeda } from '../../utils/format';
import { ResumoCard } from './ResumoCard';

export function ResumoPerdas({ resumo }) {
  return (
    <section aria-label="Resumo das perdas" className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <ResumoCard titulo="Perdas hoje" valor={moeda(resumo.totalHoje)} detalhe={`${resumo.registrosHoje} registros`} />
      <ResumoCard titulo="Maior motivo" valor={resumo.maiorMotivo} detalhe={`${resumo.percentualMotivo}% do custo total`} />
      <ResumoCard titulo="Turno crítico" valor={resumo.turnoCritico} detalhe={`${moeda(resumo.valorTurnoSemana)} na semana`} />
    </section>
  );
}