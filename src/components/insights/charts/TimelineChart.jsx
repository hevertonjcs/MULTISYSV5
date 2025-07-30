import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TimelineChart = ({ data }) => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader><CardTitle className="text-card-foreground text-base md:text-lg">Timeline de Cadastros</CardTitle></CardHeader>
      <CardContent><div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="data" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--popover-foreground))' }} 
              itemStyle={{ color: 'hsl(var(--popover-foreground))'}}
              cursor={{stroke: 'hsl(var(--accent))', strokeWidth: 1}}
            />
            <Line type="monotone" dataKey="cadastros" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r:3 }} activeDot={{ r: 5, stroke: 'hsl(var(--primary))' }}/>
          </LineChart>
        </ResponsiveContainer>
      </div></CardContent>
    </Card>
  );
};

export default TimelineChart;