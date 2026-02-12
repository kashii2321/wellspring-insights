import { useState } from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiKeyInputProps {
  onSubmit: (key: string) => void;
}

const ApiKeyInput = ({ onSubmit }: ApiKeyInputProps) => {
  const [key, setKey] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="gradient-hero rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Well-Being Analytics</h1>
          <p className="text-sm opacity-80">Student Assessment Experience Platform</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">Enter your Gemini API Key</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Required for AI-powered insights. Your key stays in your browser.
          </p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="h-11"
            />
            <Button
              onClick={() => key.trim() && onSubmit(key.trim())}
              disabled={!key.trim()}
              className="w-full h-11 gradient-primary border-0 text-primary-foreground font-semibold"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
