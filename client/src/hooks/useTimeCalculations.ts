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

  const formatTimeRemaining = (value: number, unit: string) => {
    if (unit === 'day') {
      const days = Math.floor(value);
      const remainingHours = Math.floor((value - days) * 24);
      if (days >= 1) {
        return `${days} day${days !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} left`;
      }
      return `${remainingHours} hours left`;
    } else if (unit === 'hour') {
      const hours = Math.floor(value);
      const remainingMinutes = Math.floor((value - hours) * 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} left`;
    }
    return `${Math.floor(value)} ${unit}s left`;
  };

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
      const hoursInDay = now.getHours();
      const minutesInHour = now.getMinutes();
      const dayProgress = (hoursInDay * 60 + minutesInHour) / (24 * 60);
      const remaining = total - daysGone - dayProgress;
      const currentDay = format(now, 'EEEE');
      const description = `${formatTimeRemaining(remaining, 'day')} (${currentDay})`;
      return { total, remaining, description };
    },
    day: () => {
      const hoursInDay = 24;
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const remaining = hoursInDay - currentHour - (currentMinute / 60) - (currentSecond / 3600);
      const currentTime = format(now, 'HH:mm');
      const description = `${formatTimeRemaining(remaining, 'hour')} (${currentTime})`;
      return { total: hoursInDay, remaining, description };
    }
  };

  const { total, remaining, description } = calculations[view]();
  const percentage = Math.round((remaining / total) * 100);

  return { total, remaining, percentage, description };
}