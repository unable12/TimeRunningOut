import { useState, useEffect } from 'react';
import { 
  startOfYear, 
  endOfYear, 
  startOfWeek, 
  endOfWeek, 
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  getHours,
  format,
  getDaysInYear
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
      const totalDays = getDaysInYear(now);
      const dayOfYear = differenceInDays(now, start) + 1;
      const remaining = totalDays - dayOfYear + 1;
      const partialDay = 1 - (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
      const remainingExact = remaining - 1 + partialDay;
      const description = `${remaining} days remaining in ${format(now, 'yyyy')} (Day ${dayOfYear} of ${totalDays})`;
      return { total: totalDays, remaining: remainingExact, description };
    },
    week: () => {
      const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
      const end = endOfWeek(now, { weekStartsOn: 1 });
      const total = 7;
      const daysGone = differenceInDays(now, start);
      const partialDay = 1 - (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
      const remaining = total - daysGone - 1 + partialDay;
      const currentDay = format(now, 'EEEE');
      const description = `${Math.ceil(remaining)} days left this week (${currentDay})`;
      return { total, remaining, description };
    },
    day: () => {
      const currentHour = getHours(now);
      const total = 24;
      const minutesInCurrentHour = now.getMinutes();
      const partialHour = 1 - (minutesInCurrentHour / 60);
      const remaining = 24 - currentHour - 1 + partialHour;
      const currentTime = format(now, 'HH:mm');
      const description = `${Math.ceil(remaining)} hours left today (${currentTime})`;
      return { total, remaining, description };
    }
  };

  const { total, remaining, description } = calculations[view]();
  const percentage = Math.round((remaining / total) * 100);

  return { total, remaining, percentage, description };
}