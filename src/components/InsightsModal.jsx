import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart3 } from 'lucide-react';
import { useInsightsData } from '@/components/insights/useInsightsData';
import InsightsHeader from '@/components/insights/InsightsHeader';
import InsightsSummaryCards from '@/components/insights/InsightsSummaryCards';
import InsightsTabs from '@/components/insights/InsightsTabs';
import StatusPieChart from '@/components/insights/charts/StatusPieChart';
import VendedoresBarChart from '@/components/insights/charts/VendedoresBarChart';
import TimelineLineChart from '@/components/insights/charts/TimelineLineChart';
import ModalidadesBarChart from '@/components/insights/charts/ModalidadesBarChart';
import SegmentosBarChart from '@/components/insights/charts/SegmentosBarChart';

const InsightsModal = ({ isOpen, onClose }) => {
  const {
    loading,
    period,
    setPeriod,
    insights,
    exportData,
  } = useInsightsData(isOpen);

  const tabContents = {
    status: <StatusPieChart data={insights.statusData} />,
    vendedores: <VendedoresBarChart data={insights.vendedoresData} />,
    timeline: <TimelineLineChart data={insights.timelineData} />,
    modalidades: <ModalidadesBarChart data={insights.modalidadesData} />,
    segmentos: <SegmentosBarChart data={insights.segmentosData} />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border-border p-4 md:p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center justify-between text-xl md:text-2xl">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
              Insights de Cadastros
            </span>
            <InsightsHeader
              period={period}
              setPeriod={setPeriod}
              onExport={exportData}
            />
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-muted/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-card-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <InsightsSummaryCards insights={insights} period={period} />
            <InsightsTabs tabContents={tabContents} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InsightsModal;