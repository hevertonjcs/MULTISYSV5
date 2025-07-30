import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay } from 'date-fns';

export const useCadastrosLoader = (initialFilters) => {
  const [cadastros, setCadastros] = useState([]);
  const [filteredCadastros, setFilteredCadastros] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [searchField, setSearchField] = useState(initialFilters.searchField || 'all');
  const [statusFilter, setStatusFilter] = useState(initialFilters.statusFilter || 'all_status');
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || { from: null, to: null });
  const { userInfo } = initialFilters;

  const filterAndSetCadastros = useCallback((allCadastros) => {
    let filtered = allCadastros;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(cadastro => {
        if (searchField === 'all') {
          return (
            (cadastro.nome_completo || '').toLowerCase().includes(lowerSearchTerm) || 
            (cadastro.cpf || '').replace(/\D/g, '').includes(lowerSearchTerm.replace(/\D/g, '')) ||
            (cadastro.telefone || '').replace(/\D/g, '').includes(lowerSearchTerm.replace(/\D/g, '')) ||
            (cadastro.codigo_cadastro || '').toLowerCase().includes(lowerSearchTerm) || 
            (cadastro.vendedor || '').toLowerCase().includes(lowerSearchTerm)
          );
        } else if (searchField === 'cpf' || searchField === 'telefone') {
          return (cadastro[searchField] || '').replace(/\D/g, '').includes(lowerSearchTerm.replace(/\D/g, ''));
        } else {
          return (cadastro[searchField] || '').toLowerCase().includes(lowerSearchTerm);
        }
      });
    }

    if (statusFilter && statusFilter !== 'all_status') {
       filtered = filtered.filter(cadastro => {
        const normalizedStatus = (cadastro.status_cliente || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_');
        return normalizedStatus === statusFilter;
      });
    }

    if (dateRange.from || dateRange.to) {
      const startDate = dateRange.from ? startOfDay(new Date(dateRange.from)) : null;
      const endDate = dateRange.to ? endOfDay(new Date(dateRange.to)) : null;

      filtered = filtered.filter(cadastro => {
        if (!cadastro.data_cadastro) return false;
        const cadastroDate = new Date(cadastro.data_cadastro);
        
        if (startDate && endDate) {
          return cadastroDate >= startDate && cadastroDate <= endDate;
        } else if (startDate) {
          return cadastroDate >= startDate;
        } else if (endDate) {
          return cadastroDate <= endDate;
        }
        return true;
      });
    }

    setFilteredCadastros(filtered.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro)));
  }, [searchTerm, searchField, statusFilter, dateRange]);

  const loadCadastros = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
       toast({ title: "Erro de Conexão", description: "Cliente Supabase não está disponível.", variant: "destructive" });
       setLoading(false);
       return;
    }
    try {
      let query = supabase
        .from('cadastros')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (userInfo && userInfo.tipo_acesso !== 'admin' && !userInfo.permissoes?.pode_ver_todos_cadastros) {
        query = query.eq('vendedor', userInfo.vendedor);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }
      setCadastros(data || []);
      filterAndSetCadastros(data || []);
    } catch (error) {
      console.error('Erro ao carregar cadastros:', error);
      toast({ title: "Erro Supabase", description: `Falha ao carregar dados: ${error.message}.`, variant: "destructive" });
      setCadastros([]);
      filterAndSetCadastros([]);
    } finally {
      setLoading(false);
    }
  }, [filterAndSetCadastros, toast, userInfo]);
  
  useEffect(() => {
    filterAndSetCadastros(cadastros);
  }, [searchTerm, searchField, statusFilter, dateRange, cadastros, filterAndSetCadastros]);

  return {
    cadastros,
    setCadastros,
    filteredCadastros,
    loading,
    loadCadastros,
    searchTerm, setSearchTerm,
    searchField, setSearchField,
    statusFilter, setStatusFilter,
    dateRange, setDateRange,
    filterAndSetCadastros 
  };
};