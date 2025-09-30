import { PhaseType } from '@/types/timer';

interface CircularProgressProps {
  percentage: number;
  phase: PhaseType;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ 
  percentage, 
  phase, 
  size = 320, 
  strokeWidth = 12 
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getPhaseColor = () => {
    switch (phase) {
      case 'preparation':
        return 'hsl(var(--prepare))';
      case 'work':
        return 'hsl(var(--work))';
      case 'rest':
        return 'hsl(var(--rest))';
      case 'setRest':
        return 'hsl(var(--set-rest))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        opacity="0.2"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getPhaseColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-linear"
        style={{
          filter: `drop-shadow(0 0 8px ${getPhaseColor()})`,
        }}
      />
    </svg>
  );
};

export default CircularProgress;
