import { useRef, useEffect } from 'react';
import { format, addDays, isSunday, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateScrollerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DateScroller({ selectedDate, onDateSelect }: DateScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = Array.from({ length: 60 }, (_, i) => addDays(new Date(), i - 30));

  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800">
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/90 backdrop-blur-sm p-2 rounded-r-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-amber-500" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-12 py-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((date) => {
            const isSundayDate = isSunday(date);
            const isSelected = isSameDay(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                data-selected={isSelected}
                onClick={() => !isSundayDate && onDateSelect(date)}
                disabled={isSundayDate}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center
                  w-20 h-24 rounded-2xl transition-all duration-300
                  ${isSundayDate
                    ? 'bg-slate-900/30 cursor-not-allowed opacity-40'
                    : isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 scale-105'
                      : 'bg-slate-900 hover:bg-slate-800 hover:scale-105'
                  }
                `}
              >
                <span className={`
                  text-xs font-medium uppercase tracking-wide
                  ${isSundayDate
                    ? 'text-slate-600'
                    : isSelected
                      ? 'text-slate-950'
                      : 'text-slate-400'
                  }
                `}>
                  {format(date, 'EEE', { locale: tr })}
                </span>
                <span className={`
                  text-3xl font-bold mt-1
                  ${isSundayDate
                    ? 'text-slate-700 line-through'
                    : isSelected
                      ? 'text-slate-950'
                      : 'text-white'
                  }
                `}>
                  {format(date, 'd')}
                </span>
                <span className={`
                  text-xs font-medium
                  ${isSundayDate
                    ? 'text-slate-700'
                    : isSelected
                      ? 'text-slate-950/70'
                      : 'text-slate-500'
                  }
                `}>
                  {format(date, 'MMM', { locale: tr })}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/90 backdrop-blur-sm p-2 rounded-l-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </button>
      </div>
    </div>
  );
}
