import { Shirt, Blinds } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Sale = Database['public']['Tables']['sales']['Row'];

interface TransactionListProps {
  sales: Sale[];
}

export default function TransactionList({ sales }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentBadgeColor = (method: string) => {
    switch (method) {
      case 'Nakit':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'K.K.':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'IBAN':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Mail Order':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 bg-slate-900 rounded-full mb-4">
          <Shirt className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-400 text-center">
          Bu tarih için henüz satış kaydı yok
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 pb-24">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
        Satışlar ({sales.length})
      </h2>
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50"
        >
          <div className="flex items-start gap-4">
            <div className={`
              flex-shrink-0 p-3 rounded-xl
              ${sale.category === 'Tekstil'
                ? 'bg-blue-500/10 border border-blue-500/20'
                : 'bg-purple-500/10 border border-purple-500/20'
              }
            `}>
              {sale.category === 'Tekstil' ? (
                <Shirt className={`w-6 h-6 ${sale.category === 'Tekstil' ? 'text-blue-400' : 'text-purple-400'}`} />
              ) : (
                <Blinds className="w-6 h-6 text-purple-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-white text-lg truncate">
                  {sale.product_name}
                </h3>
                <span className="flex-shrink-0 text-xl font-bold text-amber-500 tracking-tight">
                  {formatCurrency(sale.amount)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border
                  ${getPaymentBadgeColor(sale.payment_method)}
                `}>
                  {sale.payment_method}
                </span>
                <span className="text-xs text-slate-500">
                  {sale.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
