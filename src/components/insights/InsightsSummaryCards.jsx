import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, CalendarDays } from 'lucide-react';
import { formatMoeda } from '@/utils';

const InsightsSummaryCards = ({ insights, period }) => {
  if (!insights) return null; // Retorna nulo se os insights não estiverem prontos

  const periodLabel = {
    'hoje': 'Hoje',
    'semana': 'Esta Semana',
    'mes': 'Este Mês',
    '7': 'Últimos 7 dias',
    '30': 'Últimos 30 dias',
    '90': 'Últimos 90 dias',
    '365': 'Último ano',
    'todos': 'Todos'
  };

  const summaryItems = [
    { title: "Total de Cadastros", value: insights.totalCadastros || 0, icon: Users },
    { title: "Valor Total (Crédito)", value: formatMoeda(String(insights.totalValorSolicitado || '0')), icon: DollarSign },
    { title: "Valor Médio (Crédito)", value: formatMoeda(String(insights.mediaValor || '0')), icon: TrendingUp },
    { title: "Período Selecionado", value: periodLabel[period] || period, icon: CalendarDays }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
          <Card className="bg-card border-border h-full shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs md:text-sm text-muted-foreground">{item.title}</CardTitle>
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-2xl font-bold text-card-foreground">{item.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default InsightsSummaryCards;