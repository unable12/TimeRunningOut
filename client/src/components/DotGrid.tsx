import { motion } from 'framer-motion';

interface DotGridProps {
  total: number;
  remaining: number;
}

export default function DotGrid({ total, remaining }: DotGridProps) {
  const size = Math.ceil(Math.sqrt(total));

  const dots = Array.from({ length: total }).map((_, i) => {
    const isActive = i < remaining;
    return (
      <motion.div
        key={i}
        className={`rounded-full ${isActive ? 'bg-[#FFA500]' : 'bg-[#FFA500]/20'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          width: `${70 / size}vmin`,
          height: `${70 / size}vmin`,
          margin: `${15 / size}vmin`,
        }}
      />
    );
  });

  return (
    <div 
      className="grid gap-2 p-8"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {dots}
    </div>
  );
}