import { formatMoeda, formatData } from '@/utils';
import { STATUS_OPCOES, MODALIDADE_OPCOES, SEGMENTO_OPCOES } from '@/constants';

export const INSIGHTS_COLORS = [
  'hsl(var(--primary))',        // Verde principal
  'hsl(var(--accent))',         // Verde acentuado
  'hsl(180, 50%, 50%)',       // Ciano/Teal
  'hsl(200, 60%, 55%)',       // Azul claro
  'hsl(260, 50%, 60%)',       // Roxo claro
  'hsl(300, 50%, 60%)',       // Magenta claro
  'hsl(30, 70%, 60%)',        // Laranja
  'hsl(60, 70%, 50%)',        // Amarelo
  'hsl(0, 60%, 60%)',         // Vermelho claro
  'hsl(220, 30%, 60%)',       // Cinza azulado
];

export const generateInsightsData = (filteredCadastros, period, allCadastrosForGlobalMetrics = []) => {
  const totalCadastros = filteredCadastros.length;
  
  const totalValorSolicitado = filteredCadastros.reduce((sum, item) => {
    const valor = parseFloat(String(item.valor_credito || '0').replace(/[^0-9,-]+/g, "").replace(',', '.'));
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  const mediaValor = totalCadastros > 0 ? totalValorSolicitado / totalCadastros : 0;

  const statusData = STATUS_OPCOES.map(statusOpt => {
    const count = filteredCadastros.filter(c => c.status_cliente === statusOpt.value).length;
    return { 
      name: statusOpt.label, 
      value: count, 
      percentage: totalCadastros > 0 ? ((count / totalCadastros) * 100).toFixed(1) : 0 
    };
  }).filter(item => item.value > 0);

  // Para vendedores, modalidades e segmentos, considera todos os cadastros para ter uma lista completa de opções,
  // mas filtra os contadores pelo período selecionado.
  const allVendedoresSet = new Set(allCadastrosForGlobalMetrics.map(c => c.vendedor).filter(Boolean));
  const vendedoresData = Array.from(allVendedoresSet).map(vendedor => {
    const count = filteredCadastros.filter(c => c.vendedor === vendedor).length;
    return { vendedor, cadastros: count };
  }).sort((a, b) => b.cadastros - a.cadastros).slice(0, 10); // Top 10

  
  const modalidadesData = MODALIDADE_OPCOES.map(modalidade => {
    const count = filteredCadastros.filter(c => c.modalidade === modalidade).length;
    return { name: modalidade, value: count };
  }).filter(item => item.value > 0);

  const segmentosData = SEGMENTO_OPCOES.map(segmento => {
    const count = filteredCadastros.filter(c => c.segmento === segmento).length;
    return { name: segmento, value: count };
  }).filter(item => item.value > 0);


  // Timeline data (cadastros por dia no período)
  const timelineDataMap = new Map();
  filteredCadastros.forEach(c => {
    const dateStr = formatData(c.data_cadastro, 'YYYY-MM-DD'); // Usar formato consistente para chave do Map
    timelineDataMap.set(dateStr, (timelineDataMap.get(dateStr) || 0) + 1);
  });
  const timelineData = Array.from(timelineDataMap.entries())
    .map(([date, count]) => ({ data: formatData(date, 'DD/MM'), cadastros: count }))
    .sort((a,b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')));


  return {
    totalCadastros,
    totalValorSolicitado,
    mediaValor,
    statusData,
    vendedoresData,
    timelineData,
    modalidadesData,
    segmentosData,
  };
};