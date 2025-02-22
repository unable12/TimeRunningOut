import { useTimeCalculations } from '@/hooks/useTimeCalculations';
import DotGrid from './DotGrid';

interface TimeViewProps {
  view: 'year' | 'week' | 'day';
}

export default function TimeView({ view }: TimeViewProps) {
  const { total, remaining, percentage } = useTimeCalculations(view);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <DotGrid total={total} remaining={remaining} />
      <div className="mt-8 text-2xl font-light">
        {percentage}% left
      </div>
    </div>
  );
}
