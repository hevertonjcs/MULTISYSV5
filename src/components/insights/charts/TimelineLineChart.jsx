import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { INSIGHTS_COLORS } from '@/components/insights/insightsDataGenerator';

const TimelineLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Sem dados de timeline para exibir.</p>;
  }
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader><CardTitle className="text-card-foreground text-base md:text-lg">Timeline de Cadastros</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="data" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                 contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)', 
                    color: 'hsl(var(--popover-foreground))' 
                }} 
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Line type="monotone" dataKey="cadastros" stroke={INSIGHTS_COLORS[1]} strokeWidth={2} dot={{ fill: INSIGHTS_COLORS[1], r:3 }} activeDot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineLineChart;