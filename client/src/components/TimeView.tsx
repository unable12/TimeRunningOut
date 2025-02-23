import { useState, useEffect } from 'react';
import { useTimeCalculations } from '@/hooks/useTimeCalculations';
import DotGrid from './DotGrid';
import { YEARLY_QUOTES, WEEKLY_QUOTES, DAILY_QUOTES } from '@/lib/constants';

interface TimeViewProps {
  view: 'year' | 'week' | 'day';
  direction: number;
}

export default function TimeView({ view, direction }: TimeViewProps) {
  const { total, remaining, percentage, description } = useTimeCalculations(view);
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    let quotes;
    switch (view) {
      case 'year':
        quotes = YEARLY_QUOTES;
        break;
      case 'week':
        quotes = WEEKLY_QUOTES;
        break;
      case 'day':
        quotes = DAILY_QUOTES;
        break;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, [view]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <DotGrid 
        total={total} 
        remaining={remaining} 
        percentage={percentage} 
        description={description}
        quote={quote}
        view={view}
        direction={direction}
      />
    </div>
  );
}