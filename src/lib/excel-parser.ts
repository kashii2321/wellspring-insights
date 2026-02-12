import * as XLSX from 'xlsx';
import type { StudentRow, SchoolMetrics, StressCategory } from '@/types';

function getCategory(score: number): StressCategory {
  if (score <= 40) return 'Balanced';
  if (score <= 65) return 'Mild';
  if (score <= 85) return 'Moderate';
  if (score <= 90) return 'High';
  return 'Severe';
}

function reverseScore(val: number): number {
  // Reverse: 1->5, 2->4, 3->3, 4->2, 5->1
  return 6 - val;
}

function clampScore(val: unknown): number {
  const n = Number(val);
  if (isNaN(n) || n < 1) return 1;
  if (n > 5) return 5;
  return Math.round(n);
}

export function parseExcelFile(file: File): Promise<SchoolMetrics[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length < 2) {
          reject(new Error('File appears empty or has no data rows.'));
          return;
        }

        // Skip header row
        const dataRows = rows.slice(1).filter(r => r && r.length > 0);

        // Group by sname (column index varies, let's find it)
        const header = rows[0].map((h: any) => String(h).toLowerCase().trim());
        const snameIdx = header.findIndex(h => h === 'sname' || h === 'school name' || h === 'school');
        const nameColIdx = snameIdx >= 0 ? snameIdx : 0; // fallback to first column

        const schoolMap = new Map<string, any[][]>();

        for (const row of dataRows) {
          const schoolName = String(row[nameColIdx] || 'Unknown').trim();
          if (!schoolName) continue;
          if (!schoolMap.has(schoolName)) schoolMap.set(schoolName, []);
          schoolMap.get(schoolName)!.push(row);
        }

        const results: SchoolMetrics[] = [];

        for (const [schoolName, schoolRows] of schoolMap) {
          const students: StudentRow[] = [];

          for (const row of schoolRows) {
            const answers: number[] = [];

            // Q1-Q16: columns I-X (indices 8-23), normal scoring
            for (let i = 8; i <= 23; i++) {
              answers.push(clampScore(row[i]));
            }

            // Q17-Q20: columns Y-AB (indices 24-27), REVERSE scoring
            for (let i = 24; i <= 27; i++) {
              answers.push(reverseScore(clampScore(row[i])));
            }

            const totalScore = answers.reduce((a, b) => a + b, 0);

            students.push({
              sname: schoolName,
              answers,
              totalScore,
              category: getCategory(totalScore),
            });
          }

          const total = students.length;
          if (total === 0) continue;

          const avgScore = Math.round(students.reduce((s, st) => s + st.totalScore, 0) / total * 10) / 10;

          const countCat = (cat: StressCategory) => students.filter(s => s.category === cat).length;
          const pct = (n: number) => Math.round((n / total) * 100 * 10) / 10;

          // Indicators: % answering Often(4) or Always(5) on specific questions
          // Q1 = index 0, Q5 = index 4, Q19 = index 18
          // Note: Q19 is reverse-scored, so original Often/Always (4,5) become (2,1) after reverse
          // For indicators, we want the % who answered Often/Always on the ORIGINAL scale
          // So for Q17-Q20 (reversed), we check if the ORIGINAL value was 4 or 5
          // Original value = 6 - reversed_value
          const pctHighAnswer = (qIdx: number, isReversed: boolean) => {
            const count = students.filter(s => {
              const val = s.answers[qIdx];
              const originalVal = isReversed ? (6 - val) : val;
              return originalVal >= 4;
            }).length;
            return pct(count);
          };

          results.push({
            schoolName,
            totalStudents: total,
            avgScore,
            pct_balanced: pct(countCat('Balanced')),
            pct_mild: pct(countCat('Mild')),
            pct_mod: pct(countCat('Moderate')),
            pct_high: pct(countCat('High')),
            pct_severe: pct(countCat('Severe')),
            pct_anxiety: pctHighAnswer(0, false),    // Q1
            pct_pressure: pctHighAnswer(4, false),   // Q5
            pct_support: pctHighAnswer(18, true),     // Q19 (reversed)
            students,
          });
        }

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
