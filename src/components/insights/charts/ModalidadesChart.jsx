import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Palette } from 'lucide-react';
import { INSIGHTS_COLORS } from '@/components/insights/insightsDataGenerator';

const ModalidadesChart = ({ data }) => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader><CardTitle className="text-card-foreground text-base md:text-lg flex items-center gap-2"><Palette size={18} className="text-primary"/>Cadastros por Modalidade</CardTitle></CardHeader>
      <CardContent><div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--popover-foreground))' }} 
              itemStyle={{ color: 'hsl(var(--popover-foreground))'}}
              cursor={{fill: 'hsl(var(--accent) / 0.2)'}}
            />
            <Bar dataKey="value">
               {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={INSIGHTS_COLORS[index % INSIGHTS_COLORS.length]} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div></CardContent>
    </Card>
  );
};

export default ModalidadesChart;