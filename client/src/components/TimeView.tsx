import { useTimeCalculations } from '@/hooks/useTimeCalculations';
import DotGrid from './DotGrid';

interface TimeViewProps {
  view: 'year' | 'week' | 'day';
}

export default function TimeView({ view }: TimeViewProps) {
  const { total, remaining, percentage, description } = useTimeCalculations(view);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <DotGrid total={total} remaining={remaining} percentage={percentage} description={description} />
    </div>
  );
}