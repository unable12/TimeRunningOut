import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeView from '@/components/TimeView';

const views = ['year', 'week', 'day'] as const;
type View = typeof views[number];

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('year');
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleDragEnd = (event: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
    const delta = dragStart - clientX;

    if (Math.abs(delta) > 50) {
      const currentIndex = views.indexOf(currentView);
      if (delta > 0 && currentIndex < views.length - 1) {
        setCurrentView(views[currentIndex + 1]);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      } else if (delta < 0 && currentIndex > 0) {
        setCurrentView(views[currentIndex - 1]);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      }
    }
    setIsDragging(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = views.indexOf(currentView);
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentView(views[currentIndex - 1]);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      } else if (event.key === 'ArrowRight' && currentIndex < views.length - 1) {
        setCurrentView(views[currentIndex + 1]);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-black text-[#FFA500] flex flex-col font-[Inter]">
      <main 
        className="flex-1 touch-none"
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="h-full"
          >
            <TimeView view={currentView} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}