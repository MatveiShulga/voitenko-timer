import { useState } from 'react';
import SettingsScreen from '@/components/SettingsScreen';
import TimerScreen from '@/components/TimerScreen';
import CompletionScreen from '@/components/CompletionScreen';
import { TimerSettings } from '@/types/timer';
import { useTimer } from '@/hooks/useTimer';

type Screen = 'settings' | 'timer' | 'completion';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('settings');
  const [settings, setSettings] = useState<TimerSettings>({
    preparation: 15,
    work: 30,
    rest: 10,
    cycles: 5,
    setRest: 120,
    sets: 3,
  });

  const { state, start, pause, stop, reset } = useTimer(settings);

  const handleStart = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setScreen('timer');
    setTimeout(() => start(), 100);
  };

  const handleStop = () => {
    stop();
    setScreen('settings');
  };

  const handleReset = () => {
    reset();
    setScreen('settings');
  };

  // Auto-navigate to completion screen
  if (screen === 'timer' && state.phase === 'completed') {
    setTimeout(() => setScreen('completion'), 500);
  }

  return (
    <>
      {screen === 'settings' && <SettingsScreen onStart={handleStart} />}
      {screen === 'timer' && (
        <TimerScreen
          state={state}
          settings={settings}
          onPause={pause}
          onStop={handleStop}
        />
      )}
      {screen === 'completion' && <CompletionScreen onReset={handleReset} />}
    </>
  );
};

export default Index;
