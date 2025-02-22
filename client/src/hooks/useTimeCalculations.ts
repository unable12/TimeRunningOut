import { useState, useEffect } from 'react';
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
      const description = `${remaining} days remaining in ${format(now, 'yyyy')}`;
      return { total, remaining, description };
    },
    week: () => {
      const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
      const end = endOfWeek(now, { weekStartsOn: 1 });
      const total = 7;
      const remaining = differenceInDays(end, now) + 1;
      const currentDay = format(now, 'EEEE');
      const description = `${remaining} days left this week (${currentDay})`;
      return { total, remaining, description };
    },
    day: () => {
      const currentHour = getHours(now);
      const total = 24;
      const remaining = 24 - currentHour;
      const currentTime = format(now, 'HH:mm');
      const description = `${remaining} hours left today (${currentTime})`;
      return { total, remaining, description };
    }
  };

  const { total, remaining, description } = calculations[view]();
  const percentage = Math.round((remaining / total) * 100);

  return { total, remaining, percentage, description };
}