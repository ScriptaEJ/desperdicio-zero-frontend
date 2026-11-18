import { useCallback, useEffect, useMemo, useState } from 'react';
import { perdasService } from '../services/perdasService';
import { ehHoje, turnoDe } from '../utils/format';

export function usePerdas() {
  const [perdas, setPerdas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [motivo, setMotivo] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await perdasService.listar();
      setPerdas([...dados].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar as perdas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criar = async (dados) => {
    await perdasService.criar(dados);
    await carregar();
  };

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return perdas.filter(
      (p) => (!motivo || p.motivo === motivo) && (!termo || p.insumo.toLowerCase().includes(termo)),
    );
  }, [perdas, busca, motivo]);

  const resumo = useMemo(() => {
    const hoje = perdas.filter((p) => ehHoje(p.dataHora));
    const totalHoje = hoje.reduce((s, p) => s + p.custo, 0);

    const porMotivo = new Map();
    perdas.forEach((p) => porMotivo.set(p.motivo, (porMotivo.get(p.motivo) ?? 0) + p.custo));
    const totalGeral = perdas.reduce((s, p) => s + p.custo, 0);
    const [maiorMotivo, valorMotivo] = [...porMotivo.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];

    const seteDias = Date.now() - 7 * 24 * 3600 * 1000;
    const porTurno = new Map();
    perdas
      .filter((p) => new Date(p.dataHora).getTime() >= seteDias)
      .forEach((p) => porTurno.set(turnoDe(p), (porTurno.get(turnoDe(p)) ?? 0) + p.custo));
    const [turnoCritico, valorTurno] = [...porTurno.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];

    return {
      totalHoje,
      registrosHoje: hoje.length,
      maiorMotivo,
      percentualMotivo: totalGeral ? Math.round((valorMotivo / totalGeral) * 100) : 0,
      turnoCritico,
      valorTurnoSemana: valorTurno,
    };
  }, [perdas]);

  return { perdas: filtradas, resumo, carregando, erro, busca, setBusca, motivo, setMotivo, criar, recarregar: carregar };
}