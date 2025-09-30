import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import NumberInput from './NumberInput';
import { TimerSettings } from '@/types/timer';
import { Play } from 'lucide-react';

const STORAGE_KEY = 'interval-timer-settings';

interface SettingsScreenProps {
  onStart: (settings: TimerSettings) => void;
}

const SettingsScreen = ({ onStart }: SettingsScreenProps) => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage', error);
    }
    return {
      preparation: 15,
      work: 30,
      rest: 10,
      cycles: 5,
      setRest: 120,
      sets: 3,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage', error);
    }
  }, [settings]);

  const updateSetting = (key: keyof TimerSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleStart = () => {
    onStart(settings);
  };

  const isValid = Object.values(settings).every((val) => val >= 1 && val <= 999);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Интервальный Таймер
          </h1>
          <p className="text-muted-foreground">Настройте параметры тренировки</p>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-6 border border-border shadow-lg">
          <NumberInput
            label="Подготовка"
            value={settings.preparation}
            onChange={(val) => updateSetting('preparation', val)}
            suffix="сек"
          />
          <NumberInput
            label="Работа"
            value={settings.work}
            onChange={(val) => updateSetting('work', val)}
            suffix="сек"
          />
          <NumberInput
            label="Отдых"
            value={settings.rest}
            onChange={(val) => updateSetting('rest', val)}
            suffix="сек"
          />
          <NumberInput
            label="Циклы"
            value={settings.cycles}
            onChange={(val) => updateSetting('cycles', val)}
          />
          <NumberInput
            label="Отдых между сетами"
            value={settings.setRest}
            onChange={(val) => updateSetting('setRest', val)}
            suffix="сек"
          />
          <NumberInput
            label="Сеты"
            value={settings.sets}
            onChange={(val) => updateSetting('sets', val)}
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={!isValid}
          className="w-full h-16 text-xl font-bold bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Play className="mr-2 h-6 w-6" />
          СТАРТ
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;
