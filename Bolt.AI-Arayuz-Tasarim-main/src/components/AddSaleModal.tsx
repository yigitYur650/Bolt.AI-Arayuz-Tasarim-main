import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, CreditCard, ShoppingBag, Banknote } from 'lucide-react';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: any) => void;
  defaultDate: string; // App.tsx'ten gelen tarih
}

// DİKKAT: Başında 'export function' var. Bu sayede App.tsx hatasız okur.
export function AddSaleModal({ isOpen, onClose, onSave, defaultDate }: AddSaleModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tekstil');
  const [productName, setProductName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  
  // Tarih kutusu için state
  const [date, setDate] = useState(defaultDate);

  // Pencere açıldığında tarihi güncelle
  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      amount: parseFloat(amount),
      category,
      productName,
      paymentMethod,
      date, 
    });

    setAmount('');
    setProductName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden slide-in-from-bottom-4 duration-300">
        
        {/* Başlık */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Yeni Satış Ekle
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Tutar */}
          <div className="relative group">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Satış Tutarı</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold">₺</span>
              </div>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-0 text-lg font-bold text-slate-900 dark:text-white transition-all placeholder:font-normal"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tarih */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block flex items-center gap-1">
                <Calendar size={14} /> Tarih
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block flex items-center gap-1">
                <Tag size={14} /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="Tekstil">Tekstil</option>
                <option value="Perde">Perde</option>
                <option value="Outlet">Outlet</option>
                <option value="Perakende">Perakende</option>
              </select>
            </div>
          </div>

          {/* Ürün Adı - HATA BURADAYDI, ŞİMDİ DÜZELTİLDİ */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block flex items-center gap-1">
              <ShoppingBag size={14} /> Ürün Adı (Opsiyonel)
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Örn: Fon Perde..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Ödeme Yöntemi */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Ödeme Yöntemi</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Nakit')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'Nakit'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Banknote size={18} />
                <span className="font-medium text-sm">Nakit</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Kredi Kartı')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'Kredi Kartı'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={18} />
                <span className="font-medium text-sm">Kredi Kartı</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all mt-2"
          >
            Satışı Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}