import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { generateInsightsData } from '@/components/insights/insightsDataGenerator';

export const useInsightsData = (isOpen) => {
  const [allCadastros, setAllCadastros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('todos');
  const [insights, setInsights] = useState({});

  const filterDataByPeriod = useCallback((dataToFilter) => {
    let filtered = dataToFilter;
    const today = new Date();
    const currentDay = today.getDay(); 
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); 
    firstDayOfWeek.setHours(0,0,0,0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0,0,0,0);
    
    today.setHours(0,0,0,0);

    if (period === 'hoje') {
      filtered = dataToFilter.filter(c => new Date(c.data_cadastro).setHours(0,0,0,0) === today.getTime());
    } else if (period === 'semana') {
      filtered = dataToFilter.filter(c => new Date(c.data_cadastro) >= firstDayOfWeek);
    } else if (period === 'mes') {
      filtered = dataToFilter.filter(c => new Date(c.data_cadastro) >= firstDayOfMonth);
    } else if (period !== 'todos') { 
      const periodDays = parseInt(period, 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - periodDays);
      cutoffDate.setHours(0,0,0,0);
      filtered = dataToFilter.filter(c => new Date(c.data_cadastro) >= cutoffDate);
    }
    return filtered;
  }, [period]);

  const processAndSetInsights = useCallback((dataToProcess) => {
    const filteredForPeriod = filterDataByPeriod(dataToProcess);
    const generated = generateInsightsData(filteredForPeriod, period, dataToProcess);
    setInsights(generated);
  }, [period, filterDataByPeriod]);

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        let dataFromSource = [];
        if (supabase) {
          const { data: supabaseData, error } = await supabase
            .from('cadastros')
            .select('*')
            .order('data_cadastro', { ascending: false });

          if (error) {
            console.warn('Erro ao carregar dados do Supabase para Insights:', error.message);
            toast({ title: "Aviso Supabase", description: `Falha ao carregar dados para insights: ${error.message}. Usando dados locais.`, variant: "default" });
          } else if (supabaseData) {
            dataFromSource = supabaseData;
          }
        } else {
           console.warn('Supabase não conectado. Carregando de localStorage para Insights.');
        }
        
        if (dataFromSource.length === 0) {
          const localData = JSON.parse(localStorage.getItem('cadastros') || '[]');
          dataFromSource = localData.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro));
           if (supabase && dataFromSource.length > 0) {
              toast({ title: "Aviso", description: "Dados para insights carregados do localStorage (Supabase não retornou dados).", variant: "default" });
          }
        }
        setAllCadastros(dataFromSource);
      } catch (error) {
        console.error('Erro geral ao carregar dados para Insights:', error);
        const localData = JSON.parse(localStorage.getItem('cadastros') || '[]');
        setAllCadastros(localData);
        toast({ title: "Erro", description: "Falha crítica ao carregar dados para insights. Usando dados locais.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (allCadastros.length > 0) {
      processAndSetInsights(allCadastros);
    }
  }, [period, allCadastros, processAndSetInsights]);


  const exportData = () => {
    const dataToExport = filterDataByPeriod(allCadastros);
    if (!dataToExport || dataToExport.length === 0) {
      toast({ title: "Sem dados", description: "Não há dados para exportar para o período selecionado.", variant: "default" });
      return;
    }
    try {
      const csvContent = [
        ['Nome', 'CPF', 'Telefone', 'Email', 'Vendedor', 'Status', 'Valor Crédito', 'Modalidade', 'Segmento', 'Data'],
        ...dataToExport.map(item => [
          item.nome_completo || '',
          item.cpf || '',
          item.telefone || '',
          item.email || '',
          item.vendedor || '',
          item.status_cliente || '',
          item.valor_credito || '',
          item.modalidade || '',
          item.segmento || '',
          new Date(item.data_cadastro).toLocaleString('pt-BR')
        ])
      ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');

      const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `relatorio_cadastros_${period}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado!",
        description: "Arquivo CSV baixado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast({
        title: "Erro",
        description: "Falha ao exportar relatório.",
        variant: "destructive"
      });
    }
  };

  return {
    loading,
    period,
    setPeriod,
    insights,
    exportData,
  };
};