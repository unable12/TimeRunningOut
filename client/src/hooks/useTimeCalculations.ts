import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { 
  startOfYear, 
  endOfYear, 
  startOfWeek, 
  endOfWeek, 
  differenceInDays, 
  differenceInHours,
  getHours,
  format 
} from 'date-fns';

export function useTimeCalculations(view: 'year' | 'week' | 'day') {
  const { settings } = useSettings();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calculations = {
    year: () => {
      const start = startOfYear(now);
      const end = endOfYear(now);
      const total = differenceInDays(end, start) + 1;
      const remaining = differenceInDays(end, now) + 1;
      return { total, remaining };
    },
    week: () => {
      const weekStartsOn = settings.weekStart === 'monday' ? 1 : 0;
      const start = startOfWeek(now, { weekStartsOn });
      const end = endOfWeek(now, { weekStartsOn });
      const total = 7;
      const remaining = differenceInDays(end, now) + 1;
      return { total, remaining };
    },
    day: () => {
      const currentHour = getHours(now);
      const total = 24;
      const remaining = total - currentHour;

      if (settings.timeFormat === '12h') {
        const hour12 = parseInt(format(now, 'h'));
        return {
          total: 12,
          remaining: 12 - (hour12 === 12 ? 0 : hour12)
        };
      }

      return { total, remaining };
    }
  };

  const { total, remaining } = calculations[view]();
  const percentage = Math.round((remaining / total) * 100);

  return { total, remaining, percentage };
}