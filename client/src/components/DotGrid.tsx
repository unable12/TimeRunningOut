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

  const getLabel = (index: number): string => {
    if (view === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days[index];
    } else if (view === 'day') {
      return format(new Date().setHours(index), 'HH:00');
    }
    return '';
  };

  const getLabelStyle = (viewType: 'week' | 'day') => {
    const baseStyle = "absolute top-1 left-1 text-black/30 font-bold";
    return viewType === 'week'
      ? `${baseStyle} text-lg` // 70% larger for week view
      : `${baseStyle} text-sm`; // Original size for day view
  };

  // Calculate month separator positions for year view
  const getMonthSeparators = () => {
    if (view !== 'year') return [];

    const separators = [];
    let currentPosition = 0;
    const startDate = startOfYear(new Date());

    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(addMonths(startDate, month));
      currentPosition += daysInMonth;

      if (month < 11) { // Don't add separator after December
        const row = Math.floor((currentPosition - 1) / columns);
        const col = (currentPosition - 1) % columns;

        separators.push({
          row,
          col,
          isEndOfRow: col === columns - 1
        });
      }
    }

    return separators;
  };

  const monthSeparators = getMonthSeparators();

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
            width: `${70 / columns}vmin`,
            height: `${70 / columns}vmin`,
            margin: `${margin / columns}vmin`,
          }}
        >
          {label && (
            <div className={getLabelStyle(view)}>
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
          width: `${70 / columns}vmin`,
          height: `${70 / columns}vmin`,
          margin: `${margin / columns}vmin`,
          opacity
        }}
      >
        {label && (
          <div className={getLabelStyle(view)}>
            {label}
          </div>
        )}
      </div>
    );
  });

  // Calculate grid container width based on squares
  const gridContainerStyle = {
    width: `${(70 + margin * 2) * columns / columns}vmin`,
  };

  const squareSize = `${70 / columns}vmin`;
  const squareMargin = `${margin / columns}vmin`;

  return (
    <div className="flex flex-col items-center">
      <div style={gridContainerStyle}>
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
            {view === 'year' && monthSeparators.map((separator, index) => (
              <div key={`separator-${index}`} className="absolute" style={{ zIndex: 1 }}>
                {/* Horizontal line at the top of the row */}
                <div
                  className="absolute bg-white/30"
                  style={{
                    height: '1px',
                    width: separator.isEndOfRow
                      ? '100%'
                      : `calc(${(separator.col + 1) * 100 / columns}% + ${squareMargin})`,
                    top: `calc(${(separator.row + 1) * 100 / columns}% + ${squareMargin} / 2)`,
                    left: 0
                  }}
                />

                {/* Vertical drop if month ends mid-row */}
                {!separator.isEndOfRow && (
                  <div
                    className="absolute bg-white/30"
                    style={{
                      width: '1px',
                      height: `calc(${100 / columns}% + ${squareMargin})`,
                      top: `calc(${(separator.row + 1) * 100 / columns}% + ${squareMargin} / 2)`,
                      left: `calc(${(separator.col + 1) * 100 / columns}% + ${squareMargin} / 2)`
                    }}
                  />
                )}

                {/* Horizontal line on next row if month ends mid-row */}
                {!separator.isEndOfRow && (
                  <div
                    className="absolute bg-white/30"
                    style={{
                      height: '1px',
                      width: `calc(100% - ${((separator.col + 1) * 100 / columns)}% - ${squareMargin} / 2)`,
                      top: `calc(${(separator.row + 2) * 100 / columns}% + ${squareMargin} / 2)`,
                      left: `calc(${(separator.col + 1) * 100 / columns}% + ${squareMargin} / 2)`
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