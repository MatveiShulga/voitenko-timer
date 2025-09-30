import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerSettings, TimerState, PhaseType } from '@/types/timer';
import { soundManager } from '@/utils/soundManager';

export const useTimer = (settings: TimerSettings) => {
  const [state, setState] = useState<TimerState>({
    phase: 'preparation',
    currentCycle: 1,
    currentSet: 1,
    timeRemaining: settings.preparation,
    isRunning: false,
    isPaused: false,
  });

  const intervalRef = useRef<number | null>(null);
  const previousPhaseRef = useRef<PhaseType>('preparation');
  const isFirstWorkPhaseRef = useRef<boolean>(true);

  const playPhaseSound = useCallback((phase: PhaseType, fromPhase: PhaseType, cycle: number, set: number) => {
    switch (phase) {
      case 'preparation':
        soundManager.play('preparation');
        break;
      case 'work':
        // Первая работа или работа после отдыха между сетами
        if (fromPhase === 'preparation' || fromPhase === 'setRest') {
          soundManager.play('workStart');
          isFirstWorkPhaseRef.current = false;
        } else if (fromPhase === 'rest') {
          // Работа после отдыха между циклами
          soundManager.play('workAfterRest');
        }
        break;
      case 'rest':
        soundManager.play('rest');
        break;
      case 'setRest':
        // Конец сета - все циклы пройдены
        soundManager.play('setEnd');
        // Через небольшую задержку играем звук перед новым сетом
        setTimeout(() => soundManager.play('beforeNewSet'), 1500);
        break;
      case 'completed':
        soundManager.play('completion');
        break;
    }
  }, []);

  const getNextPhase = useCallback(
    (currentPhase: PhaseType, cycle: number, set: number): {
      phase: PhaseType;
      cycle: number;
      set: number;
      time: number;
    } => {
      if (currentPhase === 'preparation') {
        return { phase: 'work', cycle: 1, set: 1, time: settings.work };
      }

      if (currentPhase === 'work') {
        if (cycle < settings.cycles) {
          return { phase: 'rest', cycle, set, time: settings.rest };
        } else if (set < settings.sets) {
          return { phase: 'setRest', cycle, set, time: settings.setRest };
        } else {
          return { phase: 'completed', cycle, set, time: 0 };
        }
      }

      if (currentPhase === 'rest') {
        return { phase: 'work', cycle: cycle + 1, set, time: settings.work };
      }

      if (currentPhase === 'setRest') {
        return { phase: 'work', cycle: 1, set: set + 1, time: settings.work };
      }

      return { phase: 'completed', cycle, set, time: 0 };
    },
    [settings]
  );

  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          // Играем тик на последних 3 секундах
          if (prev.timeRemaining <= 3 && prev.timeRemaining > 1) {
            soundManager.play('tick');
          }

          if (prev.timeRemaining > 1) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          } else {
            const next = getNextPhase(prev.phase, prev.currentCycle, prev.currentSet);
            
            if (next.phase !== prev.phase) {
              playPhaseSound(next.phase, prev.phase, next.cycle, next.set);
            }

            return {
              ...prev,
              phase: next.phase,
              currentCycle: next.cycle,
              currentSet: next.set,
              timeRemaining: next.time,
              isRunning: next.phase !== 'completed',
            };
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, getNextPhase, playPhaseSound]);

  useEffect(() => {
    if (state.phase !== previousPhaseRef.current) {
      previousPhaseRef.current = state.phase;
    }
  }, [state.phase]);

  const start = useCallback(() => {
    isFirstWorkPhaseRef.current = true;
    playPhaseSound('preparation', 'preparation', 1, 1);
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  }, [playPhaseSound]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState({
      phase: 'preparation',
      currentCycle: 1,
      currentSet: 1,
      timeRemaining: settings.preparation,
      isRunning: false,
      isPaused: false,
    });
  }, [settings.preparation]);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  return {
    state,
    start,
    pause,
    stop,
    reset,
  };
};
