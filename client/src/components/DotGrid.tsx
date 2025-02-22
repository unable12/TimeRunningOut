import { motion } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
}

export default function DotGrid({ total, remaining }: DotGridProps) {
  // Adjust grid layout based on total items
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));

  const dots = Array.from({ length: total }).map((_, i) => {
    const lastSquareIndex = total - Math.ceil(remaining);
    const partialSquareIndex = total - Math.floor(remaining) - 1;

    let opacity = '0.2'; // default for used time
    if (i > partialSquareIndex) {
      opacity = '1'; // future time
    } else if (i === partialSquareIndex) {
      // Calculate partial fill for the current square
      const partialFill = (remaining % 1);
      opacity = (0.2 + (0.8 * partialFill)).toString();
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
    <div 
      className="grid px-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {dots}
    </div>
  );
}