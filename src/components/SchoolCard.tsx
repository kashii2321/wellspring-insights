import { Users, BarChart3, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SchoolMetrics } from '@/types';

interface SchoolCardProps {
  metrics: SchoolMetrics;
  onGenerate: () => void;
  isLoading: boolean;
}

const categoryColors: Record<string, string> = {
  Balanced: 'bg-success',
  Mild: 'bg-info',
  Moderate: 'bg-warning',
  High: 'bg-orange-500',
  Severe: 'bg-destructive',
};

const SchoolCard = ({ metrics, onGenerate, isLoading }: SchoolCardProps) => {
  const dominantCategory = (['Balanced', 'Mild', 'Moderate', 'High', 'Severe'] as const)
    .reduce((max, cat) => {
      const key = `pct_${cat === 'Moderate' ? 'mod' : cat.toLowerCase()}` as keyof SchoolMetrics;
      return (metrics[key] as number) > (metrics[max === 'Moderate' ? 'pct_mod' : `pct_${max.toLowerCase()}`  as keyof SchoolMetrics] as number) ? cat : max;
    }, 'Balanced' as string);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-up">
      {/* Color strip */}
      <div className={`h-1.5 ${categoryColors[dominantCategory] || 'bg-primary'}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground leading-tight">{metrics.schoolName}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{metrics.totalStudents} students</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{metrics.avgScore}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
        </div>

        {/* Mini distribution bar */}
        <div className="flex h-3 w-full rounded-full overflow-hidden mb-4">
          {metrics.pct_balanced > 0 && <div style={{ width: `${metrics.pct_balanced}%` }} className="bg-success" />}
          {metrics.pct_mild > 0 && <div style={{ width: `${metrics.pct_mild}%` }} className="bg-info" />}
          {metrics.pct_mod > 0 && <div style={{ width: `${metrics.pct_mod}%` }} className="bg-warning" />}
          {metrics.pct_high > 0 && <div style={{ width: `${metrics.pct_high}%` }} className="bg-orange-500" />}
          {metrics.pct_severe > 0 && <div style={{ width: `${metrics.pct_severe}%` }} className="bg-destructive" />}
        </div>

        {/* Key indicators */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="bg-muted rounded-lg p-2">
            <div className="text-sm font-bold text-foreground">{metrics.pct_anxiety}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Anxiety</div>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <div className="text-sm font-bold text-foreground">{metrics.pct_pressure}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pressure</div>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <div className="text-sm font-bold text-foreground">{metrics.pct_support}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Support</div>
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full gradient-primary border-0 text-primary-foreground font-semibold h-10"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SchoolCard;
