import { motion } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
  percentage: number;
  description: string;
}

export default function DotGrid({ total, remaining, percentage, description }: DotGridProps) {
  // Adjust grid layout based on total items
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));

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
            margin: `${10 / columns}vmin`,
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
          margin: `${10 / columns}vmin`,
          opacity
        }}
      />
    );
  });

  return (
    <div className="w-full px-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-light text-gray-400">
          {percentage}% left
        </div>
        <div className="text-lg text-gray-500">
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
    </div>
  );
}