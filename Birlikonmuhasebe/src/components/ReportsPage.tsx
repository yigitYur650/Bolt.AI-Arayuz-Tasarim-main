import { useState, useEffect } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { api } from '../lib/supabase';
import { FileText, Wallet, CreditCard, Globe, Tag } from 'lucide-react';

interface ReportData {
  category: string;
  amount: number;
  payment_method: string;
  product_name: string;
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);

  // --- HIZLI TARİH SEÇİMİ ---
  const setQuickDate = (type: 'week' | '1month' | '3month' | '6month' | 'year') => {
    const today = new Date();
    let start = new Date();

    switch (type) {
      case 'week':
        start = subDays(today, 7);
        break;
      case '1month':
        start = subMonths(today, 1);
        break;
      case '3month':
        start = subMonths(today, 3);
        break;
      case '6month':
        start = subMonths(today, 6);
        break;
      case 'year':
        start = subYears(today, 1);
        break;
    }
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await api.getReport(startDate, endDate);
      setData(result as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const groupedData = data.reduce((acc: any, item) => {
    const cat = item.category || 'Diğer';
    
    if (!acc[cat]) {
      acc[cat] = { total: 0, nakit: 0, kart: 0, mailOrder: 0 };
    }

    acc[cat].total += item.amount;

    if (item.payment_method === 'Nakit') {
      acc[cat].nakit += item.amount;
    } else if (item.payment_method === 'Mail Order') {
      acc[cat].mailOrder += item.amount;
    } else {
      acc[cat].kart += item.amount;
    }

    return acc;
  }, {});

  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* BAŞLIK */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Raporlar</h2>
          <p className="text-slate-400 text-sm">Detaylı Ciro Analizi</p>
        </div>
      </div>

      {/* HIZLI TARİHLER */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setQuickDate('week')} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Son 1 Hafta</button>
          <button onClick={() => setQuickDate('1month')} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Son 1 Ay</button>
          <button onClick={() => setQuickDate('3month')} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Son 3 Ay</button>
          <button onClick={() => setQuickDate('6month')} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Son 6 Ay</button>
          <button onClick={() => setQuickDate('year')} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Son 1 Yıl</button>
      </div>

      {/* TARİH SEÇİCİLER */}
      <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center">
        <div className="flex-1 px-4 py-2 border-r border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Başlangıç</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none font-medium" />
        </div>
        <div className="flex-1 px-4 py-2">
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Bitiş</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none font-medium" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Genel Toplam Ciro</p>
            <p className="text-4xl font-black text-white tracking-tight relative z-10">{formatCurrency(totalRevenue)}</p>
          </div>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-8 ml-1">Kategori Detayları</p>

          <div className="space-y-4">
            {Object.keys(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([category, stats]: [string, any]) => (
                <div key={category} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-indigo-400" />
                      <span className="text-white font-bold">{category}</span>
                    </div>
                    <span className="text-indigo-400 font-bold text-lg">{formatCurrency(stats.total)}</span>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-slate-800">
                    <div className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1 mb-1">
                        <Wallet size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Nakit</span>
                      </div>
                      <span className="text-white font-bold text-sm">{formatCurrency(stats.nakit)}</span>
                    </div>
                    <div className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1 mb-1">
                        <CreditCard size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 uppercase">K. Kartı</span>
                      </div>
                      <span className="text-white font-bold text-sm">{formatCurrency(stats.kart)}</span>
                    </div>
                    <div className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1 mb-1">
                        <Globe size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase">M. Order</span>
                      </div>
                      <span className="text-white font-bold text-sm">{formatCurrency(stats.mailOrder)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">Seçilen tarihlerde veri bulunamadı.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}