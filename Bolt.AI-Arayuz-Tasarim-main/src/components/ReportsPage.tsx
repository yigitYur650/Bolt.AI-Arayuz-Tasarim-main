import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Wallet, CreditCard, Globe, Tag, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/supabase';

interface ReportItem {
  amount: number;
  payment_method: string;
  category: string;
  product_name?: string; // İsim bilgisi eklendi
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getReport(startDate, endDate);
        setReportData(data as any[]); 
      } catch (error) {
        console.error('Rapor verisi çekilemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = reportData.reduce((sum, item) => sum + Number(item.amount), 0);

  const calculateCategoryStats = (categoryName: string) => {
    const items = reportData.filter(item => item.category === categoryName);
    
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
    const cash = items.filter(i => i.payment_method === 'Nakit').reduce((sum, i) => sum + Number(i.amount), 0);
    const mailOrder = items.filter(i => i.payment_method === 'Mail Order').reduce((sum, i) => sum + Number(i.amount), 0);
    const card = items.filter(i => i.payment_method !== 'Nakit' && i.payment_method !== 'Mail Order').reduce((sum, i) => sum + Number(i.amount), 0);

    // İsimleri al (Sadece dolu olanları)
    const names = items
      .map(i => i.product_name)
      .filter(name => name && name.trim() !== "");

    return { total, cash, card, mailOrder, names };
  };

  const categories = ['Tekstil', 'Perde', 'Outlet', 'Toptan']; 

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-amber-500" /> Raporlar
        </h1>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Başlangıç</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Bitiş</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 text-center shadow-2xl">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-semibold">Genel Toplam Ciro</p>
              <p className="text-5xl font-black text-white tracking-tight">
                {formatCurrency(totalRevenue)}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider pl-1">Kategori Detayları</h3>
              
              {categories.map((catName) => {
                const stats = calculateCategoryStats(catName);
                if (stats.total === 0) return null;

                return (
                  <div key={catName} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Tag className="text-indigo-400" size={18} />
                        <span className="font-bold text-white text-lg">{catName}</span>
                      </div>
                      <span className="font-bold text-indigo-400 text-lg">{formatCurrency(stats.total)}</span>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-slate-800">
                      <div className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1 mb-1">
                          <Wallet size={16} className="text-emerald-500" />
                          <span className="text-[10px] uppercase text-emerald-500 font-bold">Nakit</span>
                        </div>
                        <p className="text-white font-bold text-sm">{formatCurrency(stats.cash)}</p>
                      </div>
                      <div className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1 mb-1">
                          <CreditCard size={16} className="text-purple-500" />
                          <span className="text-[10px] uppercase text-purple-500 font-bold">K. Kartı</span>
                        </div>
                        <p className="text-white font-bold text-sm">{formatCurrency(stats.card)}</p>
                      </div>
                      <div className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1 mb-1">
                          <Globe size={16} className="text-blue-500" />
                          <span className="text-[10px] uppercase text-blue-500 font-bold">M. Order</span>
                        </div>
                        <p className="text-white font-bold text-sm">{formatCurrency(stats.mailOrder)}</p>
                      </div>
                    </div>

                    {/* --- PERDE İSİMLERİ DETAYI --- */}
                    {/* Sadece Perde kategorisi için ve eğer isim varsa göster */}
                    {catName === 'Perde' && stats.names.length > 0 && (
                      <div className="bg-indigo-900/10 p-3 border-t border-slate-800">
                        <div className="flex items-start gap-2">
                          <Info size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-slate-400">
                            <span className="font-semibold text-indigo-400">Satılan Perdeler: </span>
                            {stats.names.join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}

              {totalRevenue === 0 && (
                <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">Seçilen tarihlerde herhangi bir satış bulunamadı.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}