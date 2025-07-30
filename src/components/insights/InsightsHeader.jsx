import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download } from 'lucide-react';

const InsightsHeader = ({ period, setPeriod, exportData }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-card-foreground flex items-center justify-between text-xl md:text-2xl">
        <span className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          Insights de Cadastros
        </span>
        <div className="flex items-center gap-2 md:gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 md:w-40 bg-input border-border text-foreground text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            className="border-border text-primary hover:bg-muted text-xs md:text-sm"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Exportar
          </Button>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default InsightsHeader;