export interface TimerSettings {
  preparation: number;
  work: number;
  rest: number;
  cycles: number;
  setRest: number;
  sets: number;
}

export type PhaseType = 'preparation' | 'work' | 'rest' | 'setRest' | 'completed';

export interface TimerState {
  phase: PhaseType;
  currentCycle: number;
  currentSet: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
}
