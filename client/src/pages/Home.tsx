import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeView from '@/components/TimeView';
import Settings from '@/components/Settings';
import { Settings as cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const views = ['year', 'week', 'day'] as const;
type View = typeof views[number];

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('year');
  const [dragStart, setDragStart] = useState(0);

  const handleDragStart = (event: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (event: React.TouchEvent | React.MouseEvent) => {
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
  };

  return (
    <div className="min-h-screen bg-black text-[#FFA500] flex flex-col font-[Inter]">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Time Is Running Out</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <cog className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <Settings />
          </SheetContent>
        </Sheet>
      </header>

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
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <TimeView view={currentView} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
