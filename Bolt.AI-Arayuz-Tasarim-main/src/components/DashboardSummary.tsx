import { Wallet, CreditCard, TrendingUp } from 'lucide-react';

interface DashboardSummaryProps {
  cashTotal: number;
  cardTotal: number;
}

export default function DashboardSummary({ cashTotal, cardTotal }: DashboardSummaryProps) {
  const totalRevenue = cashTotal + cardTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/50 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-400">Nakit</span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(cashTotal)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-800/50 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm font-medium text-amber-400">Kart/IBAN</span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(cardTotal)}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-base font-medium text-slate-300">Günlük Ciro</span>
          </div>
        </div>
        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-tight">
          {formatCurrency(totalRevenue)}
        </p>
      </div>
    </div>
  );
}
