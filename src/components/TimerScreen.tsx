import { Button } from '@/components/ui/button';
import CircularProgress from './CircularProgress';
import { TimerState, TimerSettings } from '@/types/timer';
import { Pause, Play, Square } from 'lucide-react';

interface TimerScreenProps {
  state: TimerState;
  settings: TimerSettings;
  onPause: () => void;
  onStop: () => void;
}

const TimerScreen = ({ state, settings, onPause, onStop }: TimerScreenProps) => {
  const getPhaseLabel = () => {
    switch (state.phase) {
      case 'preparation':
        return 'Подготовка';
      case 'work':
        return 'Работа';
      case 'rest':
        return 'Отдых';
      case 'setRest':
        return 'Отдых между сетами';
      default:
        return '';
    }
  };

  const getTotalTime = () => {
    switch (state.phase) {
      case 'preparation':
        return settings.preparation;
      case 'work':
        return settings.work;
      case 'rest':
        return settings.rest;
      case 'setRest':
        return settings.setRest;
      default:
        return 1;
    }
  };

  const percentage = (state.timeRemaining / getTotalTime()) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <CircularProgress percentage={percentage} phase={state.phase} size={320} strokeWidth={12} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-bold text-foreground tabular-nums">
                  {formatTime(state.timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">{getPhaseLabel()}</h2>
            <div className="text-lg text-muted-foreground space-y-1">
              <p>
                Цикл {state.currentCycle} из {settings.cycles}
              </p>
              <p>
                Сет {state.currentSet} из {settings.sets}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onPause}
            className="flex-1 h-16 text-lg font-bold bg-gradient-secondary hover:opacity-90 transition-opacity"
            size="lg"
          >
            {state.isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
            {state.isPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА'}
          </Button>
          <Button
            onClick={onStop}
            variant="destructive"
            className="flex-1 h-16 text-lg font-bold"
            size="lg"
          >
            <Square className="mr-2 h-5 w-5" />
            СТОП
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimerScreen;
