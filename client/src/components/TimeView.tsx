import { useTimeCalculations } from '@/hooks/useTimeCalculations';
import DotGrid from './DotGrid';

interface TimeViewProps {
  view: 'year' | 'week' | 'day';
}

export default function TimeView({ view }: TimeViewProps) {
  const { total, remaining, percentage, description } = useTimeCalculations(view);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="mb-8 space-y-2 text-center">
        <div className="text-2xl font-light text-gray-400">
          {percentage}% left
        </div>
        <div className="text-lg text-gray-500">
          {description}
        </div>
      </div>
      <DotGrid total={total} remaining={remaining} />
    </div>
  );
}