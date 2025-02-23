import { motion, AnimatePresence } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
  percentage: number;
  description: string;
  quote?: string;
  view: 'year' | 'week' | 'day';
  direction: number; // -1 for previous, 1 for next
}

export default function DotGrid({ total, remaining, percentage, description, quote, view, direction }: DotGridProps) {
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
          initial={{ scale: direction > 0 ? 0.5 : 1.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: direction > 0 ? 1.5 : 0.5 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
        initial={{ scale: direction > 0 ? 0.5 : 1.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: direction > 0 ? 1.5 : 0.5 }}
        transition={{ 
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.03 * i // Stagger effect
        }}
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
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="text-2xl text-white/90">
            {percentage}% left
          </div>
          <div className="text-2xl text-white/90">
            {description}
          </div>
        </motion.div>
        <motion.div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
          initial={{ scale: direction > 0 ? 0.8 : 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: direction > 0 ? 1.2 : 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {dots}
        </motion.div>
        {quote && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-white/80 text-2xl text-center font-light uppercase tracking-[0.2em] w-full"
          >
            {quote}
          </motion.div>
        )}
      </div>
    </div>
  );
}