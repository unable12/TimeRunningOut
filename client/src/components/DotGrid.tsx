import { motion } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
}

export default function DotGrid({ total, remaining }: DotGridProps) {
  // Adjust grid layout based on total items
  const columns = total === 24 ? 6 : Math.ceil(Math.sqrt(total));

  const dots = Array.from({ length: total }).map((_, i) => {
    const isActive = i < remaining;
    return (
      <motion.div
        key={i}
        className={`${isActive ? 'bg-[#FFA500]' : 'bg-[#FFA500]/20'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          width: `${60 / columns}vmin`,
          height: `${60 / columns}vmin`,
          margin: `${10 / columns}vmin`,
        }}
      />
    );
  });

  return (
    <div 
      className="grid px-16"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {dots}
    </div>
  );
}