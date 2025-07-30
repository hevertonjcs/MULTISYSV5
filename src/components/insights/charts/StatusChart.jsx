import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { INSIGHTS_COLORS } from '@/components/insights/insightsDataGenerator';

const StatusChart = ({ data }) => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader><CardTitle className="text-card-foreground text-base md:text-lg">Distribuição por Status</CardTitle></CardHeader>
      <CardContent><div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              labelLine={false} 
              label={({ name, percentage }) => `${name} (${percentage}%)`} 
              outerRadius={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 80} 
              dataKey="value"
              stroke="hsl(var(--border))"
            >
              {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={INSIGHTS_COLORS[index % INSIGHTS_COLORS.length]} />))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--popover-foreground))' }} 
              itemStyle={{ color: 'hsl(var(--popover-foreground))'}}
            />
          </PieChart>
        </ResponsiveContainer>
      </div></CardContent>
    </Card>
  );
};

export default StatusChart;