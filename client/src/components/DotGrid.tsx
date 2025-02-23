import { format, getDaysInMonth, startOfYear, addMonths } from 'date-fns';

interface DotGridProps {
  total: number;
  remaining: number;
  percentage: number;
  description: string;
  quote?: string;
  view: 'year' | 'week' | 'day';
}

export default function DotGrid({ total, remaining, percentage, description, quote, view }: DotGridProps) {
  // Adjust grid layout based on total items
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));

  // Smaller margins for daily/weekly views
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

  // Calculate month separator positions for year view
  const getMonthData = () => {
    if (view !== 'year') return [];

    const monthData = [];
    let cumulativeDays = 0;
    const currentDate = new Date(2025, 0, 1); // Start with January 2025

    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(currentDate);
      cumulativeDays += daysInMonth;

      // Don't add separator after December
      if (month < 11) {
        // Position is right after the last day of the current month
        const lastDayPosition = cumulativeDays - 1;
        const row = Math.floor(lastDayPosition / columns);
        const col = lastDayPosition % columns;

        monthData.push({
          position: lastDayPosition,
          row,
          col,
          isEndOfRow: col === columns - 1,
          monthName: format(addMonths(currentDate, 1), 'MMM'),
          daysInMonth
        });
      }

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return monthData;
  };

  const monthData = getMonthData();

  const dots = Array.from({ length: total }).map((_, i) => {
    const lastSquareIndex = total - Math.ceil(remaining);
    const partialSquareIndex = total - Math.floor(remaining) - 1;
    const label = getLabel(i);

    let opacity = '0.2'; // default for used time
    if (i >= total - Math.floor(remaining)) {
      opacity = '1'; // future time
    } else if (i === partialSquareIndex) {
      // Calculate partial fill for the current square
      const partialFill = (remaining % 1);
      return (
        <div
          key={i}
          className="relative bg-[#FFA500]/20"
          style={{
            width: squareSize,
            height: squareSize,
            margin: squareMargin,
          }}
        >
          {label && (
            <div className={`absolute top-1 left-1 text-black/30 font-bold ${view === 'week' ? 'text-lg' : 'text-sm'}`}>
              {label}
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#FFA500]"
            style={{ height: `${partialFill * 100}%` }}
          />
        </div>
      );
    }

    return (
      <div
        key={i}
        className="relative bg-[#FFA500]"
        style={{
          width: squareSize,
          height: squareSize,
          margin: squareMargin,
          opacity
        }}
      >
        {label && (
          <div className={`absolute top-1 left-1 text-black/30 font-bold ${view === 'week' ? 'text-lg' : 'text-sm'}`}>
            {label}
          </div>
        )}
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
            {view === 'year' && monthData.map((data, index) => (
              <div key={`separator-${index}`} className="absolute" style={{ zIndex: 1 }}>
                {/* Month name label */}
                <div
                  className="absolute text-white/30 text-xs"
                  style={{
                    top: `calc(${data.row * 100 / columns}% + ${squareMargin})`,
                    left: `calc(${(data.col + 1) * 100 / columns}% + ${squareMargin})`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {data.monthName}
                </div>

                {/* Horizontal line after the last day of the month */}
                <div
                  className="absolute bg-white/30"
                  style={{
                    height: '1px',
                    width: data.isEndOfRow 
                      ? '100%' 
                      : `calc(${(data.col + 1) * 100 / columns}% + ${squareMargin})`,
                    top: `calc(${data.row * 100 / columns}% + ${70 / columns}vmin + ${margin * 2 / columns}vmin)`,
                    left: 0
                  }}
                />

                {/* Vertical line if month doesn't end at row end */}
                {!data.isEndOfRow && (
                  <div
                    className="absolute bg-white/30"
                    style={{
                      width: '1px',
                      height: `calc(${100 / columns}% + ${squareMargin})`,
                      top: `calc(${data.row * 100 / columns}% + ${70 / columns}vmin + ${margin * 2 / columns}vmin)`,
                      left: `calc(${(data.col + 1) * 100 / columns}% + ${margin / columns}vmin)`
                    }}
                  />
                )}

                {/* Horizontal line on next row if month ends mid-row */}
                {!data.isEndOfRow && (
                  <div
                    className="absolute bg-white/30"
                    style={{
                      height: '1px',
                      width: `calc(100% - ${(data.col + 1) * 100 / columns}% - ${margin / columns}vmin)`,
                      top: `calc(${(data.row + 1) * 100 / columns}% + ${margin / columns}vmin)`,
                      left: `calc(${(data.col + 1) * 100 / columns}% + ${margin / columns}vmin)`
                    }}
                  />
                )}
              </div>
            ))}
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