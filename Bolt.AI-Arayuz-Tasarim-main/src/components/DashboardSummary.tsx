import React from 'react';
import { Wallet, CreditCard, TrendingUp, Globe } from 'lucide-react';

interface DashboardSummaryProps {
  cashTotal: number;
  cardTotal: number;
  mailOrderTotal: number; // YENİ: Mail Order eklendi
}

export default function DashboardSummary({ cashTotal, cardTotal, mailOrderTotal }: DashboardSummaryProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Genel Toplam (Hepsini topla)
  const grandTotal = cashTotal + cardTotal + mailOrderTotal;

  return (
    <div className="px-4 py-4 space-y-4">
      
      {/* 3'lü Kutu Yapısı (Nakit - Kart - Mail Order) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* 1. NAKİT KUTUSU (Yeşil) */}
        <div className="bg-emerald-900/20 border border-emerald-900/50 p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Wallet size={20} className="text-emerald-500" />
            </div>
            <span className="text-emerald-500 font-medium text-sm">Nakit</span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(cashTotal)}
          </p>
        </div>

        {/* 2. KART KUTUSU (Turuncu) */}
        <div className="bg-amber-900/20 border border-amber-900/50 p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard size={48} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <CreditCard size={20} className="text-amber-500" />
            </div>
            <span className="text-amber-500 font-medium text-sm">Kart / IBAN</span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(cardTotal)}
          </p>
        </div>

        {/* 3. MAIL ORDER KUTUSU (Mavi - YENİ) */}
        <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={48} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe size={20} className="text-blue-500" />
            </div>
            <span className="text-blue-500 font-medium text-sm">Mail Order</span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(mailOrderTotal)}
          </p>
        </div>

      </div>

      {/* Günlük Toplam Ciro (Geniş Kutu) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 text-slate-400">
            <TrendingUp size={16} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Günlük Toplam Ciro</span>
          </div>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            {formatCurrency(grandTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}