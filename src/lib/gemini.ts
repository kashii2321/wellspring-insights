import type { SchoolMetrics, AIInsights } from '@/types';

export async function fetchAIInsights(
  apiKey: string,
  metrics: SchoolMetrics
): Promise<AIInsights> {
  const summary = {
    school: metrics.schoolName,
    students: metrics.totalStudents,
    avg_score: metrics.avgScore,
    pct_balanced: metrics.pct_balanced,
    pct_mild: metrics.pct_mild,
    pct_moderate: metrics.pct_mod,
    pct_high: metrics.pct_high,
    pct_severe: metrics.pct_severe,
    pct_anxiety: metrics.pct_anxiety,
    pct_pressure: metrics.pct_pressure,
    pct_support: metrics.pct_support,
  };

  const prompt = `Analyze this school well-being survey JSON: ${JSON.stringify(summary)}. 
Compare to National Benchmarks (Anxiety 81%, Pressure 66%, Support 28%). 
Return ONLY valid JSON with exactly 3 text fields: 
- "executive_summary": A 2-3 sentence overview of the school's student well-being status.
- "strengths": Key positive findings and areas where the school performs well.
- "intervention": Recommended interventions and action items for improvement.
Do not include any markdown formatting or code blocks, just raw JSON.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Sanitize markdown code blocks and extract JSON
  const cleanText = text.replace(/```json|```/g, '').trim();
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    executive_summary: parsed.executive_summary || 'No summary available.',
    strengths: parsed.strengths || 'No strengths data available.',
    intervention: parsed.intervention || 'No intervention recommendations available.',
  };
}
