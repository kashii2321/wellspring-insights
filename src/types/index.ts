export interface StudentRow {
  sname: string;
  answers: number[]; // Q1-Q20 (20 values, already scored correctly)
  totalScore: number;
  category: StressCategory;
}

export type StressCategory = 'Balanced' | 'Mild' | 'Moderate' | 'High' | 'Severe';

export interface SchoolMetrics {
  schoolName: string;
  totalStudents: number;
  avgScore: number;
  pct_balanced: number;
  pct_mild: number;
  pct_mod: number;
  pct_high: number;
  pct_severe: number;
  pct_anxiety: number;   // % answering Often/Always on Q1
  pct_pressure: number;  // % answering Often/Always on Q5
  pct_support: number;   // % answering Often/Always on Q19
  students: StudentRow[];
}

export interface AIInsights {
  executive_summary: string;
  strengths: string;
  intervention: string;
}

export interface SchoolReport {
  metrics: SchoolMetrics;
  aiInsights: AIInsights | null;
  isLoading: boolean;
  error: string | null;
}
