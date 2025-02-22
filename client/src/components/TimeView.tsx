import { useState, useEffect } from 'react';
import { useTimeCalculations } from '@/hooks/useTimeCalculations';
import DotGrid from './DotGrid';
import { YEARLY_QUOTES } from '@/lib/constants';

interface TimeViewProps {
  view: 'year' | 'week' | 'day';
}

export default function TimeView({ view }: TimeViewProps) {
  const { total, remaining, percentage, description } = useTimeCalculations(view);
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    if (view === 'year') {
      const randomIndex = Math.floor(Math.random() * YEARLY_QUOTES.length);
      setQuote(YEARLY_QUOTES[randomIndex]);
    } else {
      setQuote('');
    }
  }, [view]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <DotGrid 
        total={total} 
        remaining={remaining} 
        percentage={percentage} 
        description={description}
        quote={quote}
      />
    </div>
  );
}