import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

interface DotGridProps {
  total: number;
  remaining: number;
}

export default function DotGrid({ total, remaining }: DotGridProps) {
  const { settings } = useSettings();
  const size = Math.ceil(Math.sqrt(total));
  
  const dots = Array.from({ length: total }).map((_, i) => {
    const isActive = i < remaining;
    return settings.visualStyle === 'dots' ? (
      <motion.div
        key={i}
        className={`rounded-full ${isActive ? 'bg-[#FFA500]' : 'bg-[#FFA500]/20'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          width: `${90 / size}vmin`,
          height: `${90 / size}vmin`,
          margin: `${20 / size}vmin`,
        }}
      />
    ) : (
      <motion.div
        key={i}
        className="w-full"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0.2 }}
        style={{
          height: `${90 / size}vmin`,
          backgroundColor: '#FFA500',
          margin: `${20 / size}vmin 0`,
          transformOrigin: 'bottom',
        }}
      />
    );
  });

  return (
    <div 
      className={`grid gap-1 ${settings.visualStyle === 'dots' ? 'grid-flow-row' : 'flex'}`}
      style={{
        gridTemplateColumns: settings.visualStyle === 'dots' ? `repeat(${size}, 1fr)` : undefined,
      }}
    >
      {dots}
    </div>
  );
}
