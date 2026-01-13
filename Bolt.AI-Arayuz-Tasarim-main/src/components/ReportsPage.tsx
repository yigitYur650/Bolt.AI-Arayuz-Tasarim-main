import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Wallet, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [cardTotal, setCardTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('amount, payment_method')
        .gte('sale_date', startDate)
        .lte('sale_date', endDate);

      if (error) throw error;

      if (data) {
        const total = data.reduce((sum, sale) => sum + Number(sale.amount), 0);
        const cash = data
          .filter(sale => sale.payment_method === 'Nakit')
          .reduce((sum, sale) => sum + Number(sale.amount), 0);
        const card = data
          .filter(sale => ['K.K.', 'IBAN', 'Mail Order'].includes(sale.payment_method))
          .reduce((sum, sale) => sum + Number(sale.amount), 0);

        setTotalRevenue(total);
        setCashTotal(cash);
        setCardTotal(card);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Raporlar</h1>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="block text-xs font-medium text-slate-400 mb-2">
              Başlangıç Tarihi
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-xs font-medium text-slate-400 mb-2">
              Bitiş Tarihi
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 via-amber-950/40 to-slate-950 border border-amber-800/50 rounded-3xl p-6 shadow-2xl shadow-amber-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                </div>
                <span className="text-lg font-medium text-slate-300">Toplam Ciro</span>
              </div>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-tight">
                {formatCurrency(totalRevenue)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-emerald-400">Nakit</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {formatCurrency(cashTotal)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {totalRevenue > 0 ? `%${((cashTotal / totalRevenue) * 100).toFixed(1)}` : '%0'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-800/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-amber-400">Kart/IBAN</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {formatCurrency(cardTotal)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {totalRevenue > 0 ? `%${((cardTotal / totalRevenue) * 100).toFixed(1)}` : '%0'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Dönem Özeti
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Seçili Tarih Aralığı:</span>
                  <span className="text-white font-medium">
                    {new Date(startDate).toLocaleDateString('tr-TR')} - {new Date(endDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Toplam Ciro:</span>
                    <span className="text-amber-500 font-bold text-lg">
                      {formatCurrency(totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
