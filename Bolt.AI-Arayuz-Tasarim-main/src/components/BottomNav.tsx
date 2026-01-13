import { ShoppingBag, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'sales' | 'reports';
  onTabChange: (tab: 'sales' | 'reports') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-40 safe-bottom">
      <div className="grid grid-cols-2 max-w-lg mx-auto">
        <button
          onClick={() => onTabChange('sales')}
          className={`
            flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200
            ${activeTab === 'sales'
              ? 'text-amber-500'
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
        >
          <ShoppingBag className={`w-6 h-6 ${activeTab === 'sales' ? 'stroke-2' : ''}`} />
          <span className={`text-xs font-medium ${activeTab === 'sales' ? 'font-semibold' : ''}`}>
            Satışlar
          </span>
          {activeTab === 'sales' && (
            <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-b-full" />
          )}
        </button>

        <button
          onClick={() => onTabChange('reports')}
          className={`
            flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200
            ${activeTab === 'reports'
              ? 'text-amber-500'
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
        >
          <BarChart3 className={`w-6 h-6 ${activeTab === 'reports' ? 'stroke-2' : ''}`} />
          <span className={`text-xs font-medium ${activeTab === 'reports' ? 'font-semibold' : ''}`}>
            Raporlar
          </span>
          {activeTab === 'reports' && (
            <div className="absolute top-0 left-3/4 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-b-full" />
          )}
        </button>
      </div>
    </nav>
  );
}
