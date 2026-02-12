import type { SchoolMetrics, AIInsights } from '@/types';

interface ReportTemplateProps {
  metrics: SchoolMetrics;
  aiInsights: AIInsights;
}

const ReportTemplate = ({ metrics, aiInsights }: ReportTemplateProps) => {
  return (
    <div id="report-content" className="max-w-5xl mx-auto bg-white p-8 font-sans text-slate-800 report-print">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white p-12 text-center rounded-xl mb-8">
        <h1 className="text-4xl font-bold uppercase mb-2">{metrics.schoolName}</h1>
        <p className="opacity-90 text-lg">Student Assessment Experience Survey</p>
        <p className="opacity-70 text-sm mt-2">{metrics.totalStudents} Students Surveyed • Average Score: {metrics.avgScore}/100</p>
      </header>

      {/* Executive Summary */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Executive Summary</h3>
          <p className="text-lg leading-relaxed text-slate-600">{aiInsights.executive_summary}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-600">
          <h3 className="font-bold text-blue-900 mb-2 text-lg">Key Strengths</h3>
          <p className="text-slate-600 leading-relaxed">{aiInsights.strengths}</p>
        </div>
      </section>

      {/* Stress Category Distribution */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Stress Category Distribution</h3>
        {/* Stacked Bar */}
        <div className="flex h-16 w-full rounded-xl overflow-hidden shadow-lg mb-6">
          {metrics.pct_balanced > 0 && (
            <div style={{ width: `${metrics.pct_balanced}%` }} className="bg-green-500 flex items-center justify-center text-white font-bold text-xs">
              {metrics.pct_balanced > 5 ? `${metrics.pct_balanced}%` : ''}
            </div>
          )}
          {metrics.pct_mild > 0 && (
            <div style={{ width: `${metrics.pct_mild}%` }} className="bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {metrics.pct_mild > 5 ? `${metrics.pct_mild}%` : ''}
            </div>
          )}
          {metrics.pct_mod > 0 && (
            <div style={{ width: `${metrics.pct_mod}%` }} className="bg-yellow-500 flex items-center justify-center text-white font-bold text-xs">
              {metrics.pct_mod > 5 ? `${metrics.pct_mod}%` : ''}
            </div>
          )}
          {metrics.pct_high > 0 && (
            <div style={{ width: `${metrics.pct_high}%` }} className="bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              {metrics.pct_high > 5 ? `${metrics.pct_high}%` : ''}
            </div>
          )}
          {metrics.pct_severe > 0 && (
            <div style={{ width: `${metrics.pct_severe}%` }} className="bg-red-500 flex items-center justify-center text-white font-bold text-xs">
              {metrics.pct_severe > 5 ? `${metrics.pct_severe}%` : ''}
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="grid grid-cols-5 gap-4 text-center text-xs font-bold uppercase text-gray-500">
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>Balanced ({metrics.pct_balanced}%)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span>Mild ({metrics.pct_mild}%)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span>Moderate ({metrics.pct_mod}%)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span>High ({metrics.pct_high}%)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>Severe ({metrics.pct_severe}%)</span>
          </div>
        </div>
      </section>

      {/* National Benchmark Comparison */}
      <section className="bg-slate-50 p-8 rounded-xl mb-12">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">National Benchmark Comparison</h3>
        <div className="space-y-8">
          {/* Anxiety */}
          <BenchmarkBar label="Exam Anxiety" national={81} school={metrics.pct_anxiety} color="bg-blue-600" />
          {/* Pressure */}
          <BenchmarkBar label="Academic Pressure" national={66} school={metrics.pct_pressure} color="bg-indigo-600" />
          {/* Support */}
          <BenchmarkBar label="Lack of Support" national={28} school={metrics.pct_support} color="bg-teal-600" />
        </div>
      </section>

      {/* Intervention Recommendations */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Intervention Recommendations</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-slate-700 leading-relaxed">{aiInsights.intervention}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 pt-6 border-t border-gray-200">
        <p>Generated by Student Well-Being Analytics Platform • Confidential</p>
      </footer>
    </div>
  );
};

function BenchmarkBar({ label, national, school, color }: { label: string; national: number; school: number; color: string }) {
  const max = Math.max(national, school, 100);
  return (
    <div>
      <div className="flex justify-between font-bold text-gray-600 mb-2">
        <span>{label} (National: {national}%)</span>
        <span className="text-blue-700">School: {school}%</span>
      </div>
      <div className="relative h-5 bg-gray-200 rounded-full overflow-visible">
        <div style={{ width: `${Math.min(school, 100)}%` }} className={`h-full ${color} rounded-full transition-all duration-500`} />
        {/* National benchmark marker */}
        <div
          className="absolute top-0 w-0.5 h-full bg-red-500"
          style={{ left: `${Math.min(national, 100)}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-500 whitespace-nowrap">
            {national}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTemplate;
