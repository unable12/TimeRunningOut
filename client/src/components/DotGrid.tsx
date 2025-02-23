import { motion } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
  percentage: number;
  description: string;
  quote?: string;
}

export default function DotGrid({ total, remaining, percentage, description, quote }: DotGridProps) {
  // Adjust grid layout based on total items
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));

  // Smaller margins for daily/weekly views
  const margin = total <= 24 ? 2 : 10;

  const dots = Array.from({ length: total }).map((_, i) => {
    const lastSquareIndex = total - Math.ceil(remaining);
    const partialSquareIndex = total - Math.floor(remaining) - 1;

    let opacity = '0.2'; // default for used time
    if (i >= total - Math.floor(remaining)) {
      opacity = '1'; // future time
    } else if (i === partialSquareIndex) {
      // Calculate partial fill for the current square
      const partialFill = (remaining % 1);
      return (
        <motion.div
          key={i}
          className="relative bg-[#FFA500]/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            width: `${70 / columns}vmin`,
            height: `${70 / columns}vmin`,
            margin: `${margin / columns}vmin`,
          }}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#FFA500]"
            style={{ height: `${partialFill * 100}%` }}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        key={i}
        className="bg-[#FFA500]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          width: `${70 / columns}vmin`,
          height: `${70 / columns}vmin`,
          margin: `${margin / columns}vmin`,
          opacity
        }}
      />
    );
  });

  // Calculate grid container width based on squares
  const gridContainerStyle = {
    width: `${(70 + margin * 2) * columns / columns}vmin`,
  };

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
        <div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {dots}
        </div>
        {quote && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-white/80 text-lg text-center font-light uppercase tracking-wide w-full"
          >
            {quote}
          </motion.div>
        )}
      </div>
    </div>
  );
}