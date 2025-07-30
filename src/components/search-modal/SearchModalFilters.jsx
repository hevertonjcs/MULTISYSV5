import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Filter, X, CalendarPlus as CalendarIcon } from 'lucide-react';
import { STATUS_OPCOES } from '@/constants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SEARCH_FIELD_OPTIONS = [
  { value: 'all', label: 'Todos os Campos' },
  { value: 'nome_completo', label: 'Nome' },
  { value: 'cpf', label: 'CPF' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'codigo_cadastro', label: 'Código' },
];

const SearchModalFilters = ({ 
  searchTerm, 
  setSearchTerm,
  searchField,
  setSearchField,
  statusFilter, 
  setStatusFilter, 
  dateRange,
  setDateRange,
  loadCadastros, 
  loading 
}) => {

  const handleDatePreset = (preset) => {
    const today = new Date();
    let startDate, endDate = today;

    switch (preset) {
      case 'today':
        startDate = today;
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = startDate;
        break;
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        startDate = null;
        endDate = null;
    }
    setDateRange({ from: startDate, to: endDate });
  };

  const clearDateFilter = () => {
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4 bg-card border-border rounded-lg shadow-sm">
      <div className="space-y-2 xl:col-span-1">
        <Label htmlFor="search-field" className="text-muted-foreground text-xs">Buscar em</Label>
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger id="search-field" className="bg-input border-border text-foreground h-9 text-sm">
            <SelectValue placeholder="Selecionar campo" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {SEARCH_FIELD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 xl:col-span-1">
        <Label htmlFor="search-term" className="text-muted-foreground text-xs">Termo de Busca</Label>
        <Input
          id="search-term"
          placeholder="Digite para buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground h-9 text-sm"
        />
      </div>
      
      <div className="space-y-2 xl:col-span-1">
        <Label htmlFor="status-filter" className="text-muted-foreground text-xs">Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="status-filter" className="bg-input border-border text-foreground h-9 text-sm">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all_status">Todos os status</SelectItem>
            {STATUS_OPCOES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 xl:col-span-1">
        <Label htmlFor="date-range-start" className="text-muted-foreground text-xs">Data Início</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-range-start"
              variant={"outline"}
              className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-muted h-9 text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card" align="start">
            <Calendar
              mode="single"
              selected={dateRange?.from}
              onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 xl:col-span-1">
        <Label htmlFor="date-range-end" className="text-muted-foreground text-xs">Data Fim</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-range-end"
              variant={"outline"}
              className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-muted h-9 text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card" align="start">
            <Calendar
              mode="single"
              selected={dateRange?.to}
              onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
              disabled={(date) => dateRange?.from && date < dateRange.from}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-end space-x-2 xl:col-span-1">
        { (dateRange?.from || dateRange?.to) && (
          <Button
            onClick={clearDateFilter}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:bg-muted"
            title="Limpar filtro de data"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={loadCadastros}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
          ) : (
            <Filter className="w-4 h-4 mr-2" />
          )}
          Filtrar
        </Button>
      </div>

      <div className="md:col-span-2 lg:col-span-3 xl:col-span-6 flex flex-wrap gap-2 mt-2">
        <Button variant="outline" size="xs" className="text-xs h-7" onClick={() => handleDatePreset('today')}>Hoje</Button>
        <Button variant="outline" size="xs" className="text-xs h-7" onClick={() => handleDatePreset('yesterday')}>Ontem</Button>
        <Button variant="outline" size="xs" className="text-xs h-7" onClick={() => handleDatePreset('last7days')}>Últimos 7 dias</Button>
        <Button variant="outline" size="xs" className="text-xs h-7" onClick={() => handleDatePreset('thisMonth')}>Este Mês</Button>
        <Button variant="outline" size="xs" className="text-xs h-7" onClick={() => handleDatePreset('lastMonth')}>Mês Passado</Button>
      </div>
    </div>
  );
};

export default SearchModalFilters;