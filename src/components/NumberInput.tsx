import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}

const NumberInput = ({ label, value, onChange, min = 1, max = 999, suffix }: NumberInputProps) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-12 w-12 shrink-0 border-muted hover:bg-muted"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            className="h-12 text-center text-lg font-bold bg-input border-muted"
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-12 w-12 shrink-0 border-muted hover:bg-muted"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default NumberInput;
