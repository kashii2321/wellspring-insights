import { useRef, useState } from 'react';
import { Download, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ReportTemplate from './ReportTemplate';
import type { SchoolMetrics, AIInsights } from '@/types';

interface ReportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  metrics: SchoolMetrics;
  aiInsights: AIInsights;
}

const ReportPreviewModal = ({ open, onClose, metrics, aiInsights }: ReportPreviewModalProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const options: Record<string, any> = {
        margin: [10, 10, 10, 10],
        filename: `${metrics.schoolName.replace(/\s+/g, '_')}_WellBeing_Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      await html2pdf()
        .set(options)
        .from(reportRef.current)
        .save();
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <h2 className="text-lg font-bold text-foreground">Report Preview — {metrics.schoolName}</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="gradient-primary border-0 text-primary-foreground font-semibold"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <div ref={reportRef}>
            <ReportTemplate metrics={metrics} aiInsights={aiInsights} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreviewModal;
