import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusChart from '@/components/insights/charts/StatusChart';
import VendedoresChart from '@/components/insights/charts/VendedoresChart';
import TimelineChart from '@/components/insights/charts/TimelineChart';
import ModalidadesChart from '@/components/insights/charts/ModalidadesChart';
import SegmentosChart from '@/components/insights/charts/SegmentosChart';

const InsightsTabs = ({ insights }) => {
  // Garantir que `insights` não seja nulo ou indefinido antes de acessar suas propriedades
  if (!insights) {
    return null; // ou um componente de loading/placeholder
  }

  const tabConfig = [
    { value: "status", label: "Status", component: <StatusChart data={insights.statusData || []} /> },
    { value: "vendedores", label: "Vendedores", component: <VendedoresChart data={insights.vendedoresData || []} /> },
    { value: "timeline", label: "Timeline", component: <TimelineChart data={insights.timelineData || []} /> },
    { value: "modalidades", label: "Modalidades", component: <ModalidadesChart data={insights.modalidadesData || []} /> },
    { value: "segmentos", label: "Segmentos", component: <SegmentosChart data={insights.segmentosData || []} /> },
  ];

  return (
    <Tabs defaultValue="status" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-muted/50 rounded-md">
        {tabConfig.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md text-xs md:text-sm rounded-md"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabConfig.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default InsightsTabs;