import { useState, useCallback } from 'react';
import { BarChart3, GraduationCap, Shield } from 'lucide-react';
import ApiKeyInput from '@/components/ApiKeyInput';
import FileUpload from '@/components/FileUpload';
import SchoolCard from '@/components/SchoolCard';
import ReportPreviewModal from '@/components/ReportPreviewModal';
import { parseExcelFile } from '@/lib/excel-parser';
import { fetchAIInsights } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';
import type { SchoolMetrics, AIInsights } from '@/types';

const Index = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [apiKey, setApiKey] = useState<string>(envKey || '');
  const [schools, setSchools] = useState<SchoolMetrics[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingSchool, setLoadingSchool] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ metrics: SchoolMetrics; insights: AIInsights } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const results = await parseExcelFile(file);
      if (results.length === 0) {
        toast({ title: 'No data found', description: 'Could not find any school data in the file.', variant: 'destructive' });
      } else {
        setSchools(results);
        toast({ title: 'Success', description: `Loaded ${results.length} school(s) with ${results.reduce((s, r) => s + r.totalStudents, 0)} students.` });
      }
    } catch (err: any) {
      toast({ title: 'Error parsing file', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handleGenerate = async (metrics: SchoolMetrics) => {
    setLoadingSchool(metrics.schoolName);
    try {
      const insights = await fetchAIInsights(apiKey, metrics);
      setPreviewData({ metrics, insights });
    } catch (err: any) {
      toast({ title: 'AI Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingSchool(null);
    }
  };

  if (!apiKey) {
    return <ApiKeyInput onSubmit={setApiKey} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Analytics Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Well-Being Analytics</h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Upload survey data, generate AI-powered insights, and download professional reports for each school.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Upload Section */}
        <section className="mb-10 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Upload Survey Data</h2>
          </div>
          <FileUpload onFileSelect={handleFileUpload} isProcessing={isProcessing} />
        </section>

        {/* Schools Grid */}
        {schools.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Schools ({schools.length})</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {schools.reduce((s, r) => s + r.totalStudents, 0)} total students
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard
                  key={school.schoolName}
                  metrics={school}
                  onGenerate={() => handleGenerate(school)}
                  isLoading={loadingSchool === school.schoolName}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {schools.length === 0 && !isProcessing && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No data loaded</h3>
            <p className="text-muted-foreground">Upload an Excel file to get started with the analysis.</p>
          </div>
        )}
      </main>

      {/* Report Preview Modal */}
      {previewData && (
        <ReportPreviewModal
          open={!!previewData}
          onClose={() => setPreviewData(null)}
          metrics={previewData.metrics}
          aiInsights={previewData.insights}
        />
      )}
    </div>
  );
};

export default Index;
