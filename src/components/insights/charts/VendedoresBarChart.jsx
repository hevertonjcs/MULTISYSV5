import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { INSIGHTS_COLORS } from '@/components/insights/insightsDataGenerator';

const VendedoresBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Sem dados de vendedores para exibir.</p>;
  }
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader><CardTitle className="text-card-foreground text-base md:text-lg">Performance dos Vendedores (Nº Cadastros)</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="vendedor" type="category" stroke="hsl(var(--muted-foreground))" width={80} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)', 
                    color: 'hsl(var(--popover-foreground))' 
                }} 
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Bar dataKey="cadastros" fill={INSIGHTS_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendedoresBarChart;