import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InsightsHeader from '@/components/insights/InsightsHeader';
import InsightsSummaryCards from '@/components/insights/InsightsSummaryCards';
import InsightsTabs from '@/components/insights/InsightsTabs';
import { useInsightsData } from '@/components/insights/useInsightsData';

const InsightsModal = ({ isOpen, onClose }) => {
  const {
    loading,
    period,
    setPeriod,
    insights,
    exportData,
  } = useInsightsData(isOpen);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border-border p-4 md:p-6 rounded-lg shadow-xl">
        <InsightsHeader period={period} setPeriod={setPeriod} exportData={exportData} />

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-muted/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-card-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <InsightsSummaryCards insights={insights} period={period} />
            <InsightsTabs insights={insights} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InsightsModal;