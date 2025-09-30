import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface CompletionScreenProps {
  onReset: () => void;
}

const CompletionScreen = ({ onReset }: CompletionScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle2 className="w-32 h-32 text-accent animate-scale-in" />
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{ background: 'hsl(var(--accent))' }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-success bg-clip-text text-transparent">
              Отлично!
            </h1>
            <p className="text-2xl font-semibold text-foreground">
              Тренировка завершена
            </p>
            <p className="text-lg text-muted-foreground">
              Вы проделали отличную работу
            </p>
          </div>
        </div>

        <Button
          onClick={onReset}
          className="w-full h-16 text-xl font-bold bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <RotateCcw className="mr-2 h-6 w-6" />
          НОВАЯ ТРЕНИРОВКА
        </Button>
      </div>
    </div>
  );
};

export default CompletionScreen;
