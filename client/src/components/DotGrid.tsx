import { format, addDays, addHours, formatDistanceToNow, isFuture } from 'date-fns';

interface DotGridProps {
  total: number;
  remaining: number;
  percentage: number;
  description: string;
  quote?: string;
  view: 'year' | 'week' | 'day';
}

export default function DotGrid({ total, remaining, percentage, description, quote, view }: DotGridProps) {
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));
  const margin = total <= 24 ? 2 : 10;
  const squareSize = `${70 / columns}vmin`;
  const squareMargin = `${margin / columns}vmin`;

  const getLabel = (index: number): string => {
    if (view === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days[index];
    } else if (view === 'day') {
      return format(new Date().setHours(index), 'HH:00');
    }
    return '';
  };

  const getDateForIndex = (index: number): Date => {
    const now = new Date();
    if (view === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return addDays(startOfYear, index);
    } else if (view === 'week') {
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
      return addDays(startOfWeek, index);
    } else {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);
      return addHours(startOfDay, index);
    }
  };

  const getTooltipText = (index: number): string => {
    const date = getDateForIndex(index);
    const formattedDate = format(date, view === 'day' ? 'HH:mm, MMM d' : 'MMM d, yyyy');
    const timePhrase = isFuture(date) ? 'will be in' : 'was';
    const distance = formatDistanceToNow(date, { addSuffix: true });
    return `${formattedDate} (${timePhrase} ${distance})`;
  };

  // Get month letter if this square is part of a month name
  const getMonthLetter = (index: number): string => {
    if (view !== 'year') return '';

    const monthStarts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                     'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    const monthIndex = monthStarts.findIndex((start, i) => {
      const nextStart = monthStarts[i + 1] || 366;
      return index >= start && index < nextStart;
    });

    if (monthIndex >= 0) {
      const monthName = monthNames[monthIndex];
      const letterIndex = index - monthStarts[monthIndex];
      return letterIndex < monthName.length ? monthName[letterIndex] : '';
    }

    return '';
  };

  const dots = Array.from({ length: total }).map((_, i) => {
    const lastSquareIndex = total - Math.ceil(remaining);
    const partialSquareIndex = total - Math.floor(remaining) - 1;
    const label = getLabel(i);
    const monthLetter = getMonthLetter(i);
    const isCurrentTimeBlock = i === partialSquareIndex;
    const isPastTimeBlock = i < partialSquareIndex;

    let opacity = '0.2'; // default for used time
    if (i >= total - Math.floor(remaining)) {
      opacity = '1'; // future time
    } else if (isCurrentTimeBlock) {
      // Calculate partial fill for the current square
      const partialFill = (remaining % 1);
      return (
        <div
          key={i}
          className="relative bg-[#FFA500]/20 group"
          style={{
            width: squareSize,
            height: squareSize,
            margin: squareMargin,
          }}
          title={getTooltipText(i)}
        >
          {monthLetter && (
            <div className="absolute inset-0 flex items-center justify-center text-black text-lg font-bold">
              {monthLetter}
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#FFA500]"
            style={{ height: `${partialFill * 100}%` }}
          />
          {label && (
            <div
              className={`absolute top-1 left-1 text-black z-10 ${
                view === 'week' ? 'text-lg' : 'text-sm'
              } font-normal`}
              style={{ 
                fontFamily: 'SF Pro Display, system-ui'
              }}
            >
              {label}
            </div>
          )}
          <div className="absolute inset-0 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 text-xs text-center">
            {getTooltipText(i)}
          </div>
        </div>
      );
    }

    return (
      <div
        key={i}
        className="relative bg-[#FFA500] group"
        style={{
          width: squareSize,
          height: squareSize,
          margin: squareMargin,
          opacity
        }}
        title={getTooltipText(i)}
      >
        {monthLetter && (
          <div className="absolute inset-0 flex items-center justify-center text-black text-lg font-bold">
            {monthLetter}
          </div>
        )}
        {label && (
          <div
            className={`absolute top-1 left-1 text-black z-10 ${
              view === 'week' ? 'text-lg' : 'text-sm'
            } ${isPastTimeBlock ? 'font-normal' : 'font-bold'}`}
            style={{ 
              textShadow: '0px 0px 1px rgba(255, 255, 255, 0.5)',
              fontFamily: 'SF Pro Display, system-ui'
            }}
          >
            {label}
          </div>
        )}
        <div className="absolute inset-0 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 text-xs text-center">
          {getTooltipText(i)}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: `${(70 + margin * 2) * columns / columns}vmin` }}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl text-white/90">
            {percentage}% left
          </div>
          <div className="text-2xl text-white/90">
            {description}
          </div>
        </div>
        <div className="relative">
          <div
            className="grid relative"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {dots}
          </div>
        </div>
        {quote && (
          <div className="mt-4 text-white/80 text-2xl text-center font-light uppercase tracking-[0.2em] w-full">
            {quote}
          </div>
        )}
      </div>
    </div>
  );
}