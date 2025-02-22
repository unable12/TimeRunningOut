import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { startOfYear, endOfYear, startOfWeek, endOfWeek, differenceInDays, differenceInHours, format } from 'date-fns';

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
      const weekOptions = { weekStartsOn: settings.weekStart === 'monday' ? 1 : 0 };
      const start = startOfWeek(now, weekOptions);
      const end = endOfWeek(now, weekOptions);
      const total = 7;
      const remaining = differenceInDays(end, now) + 1;
      return { total, remaining };
    },
    day: () => {
      const total = settings.timeFormat === '24h' ? 24 : 12;
      const hour = parseInt(format(now, settings.timeFormat === '24h' ? 'H' : 'h'));
      const remaining = total - hour;
      return { total, remaining };
    }
  };

  const { total, remaining } = calculations[view]();
  const percentage = Math.round((remaining / total) * 100);

  return { total, remaining, percentage };
}
