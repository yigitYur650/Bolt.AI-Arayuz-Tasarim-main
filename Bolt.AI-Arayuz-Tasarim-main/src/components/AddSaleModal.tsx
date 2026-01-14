import React, { useState, useEffect } from 'react';
import { X, Tag, CreditCard, Banknote, Globe, ShoppingBag } from 'lucide-react'; // ShoppingBag geri geldi

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: any) => void;
  defaultDate: string;
  saleToEdit?: any;
}

export function AddSaleModal({ isOpen, onClose, onSave, defaultDate, saleToEdit }: AddSaleModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tekstil');
  const [productName, setProductName] = useState(''); // Ürün adı state'i geri geldi
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  
  useEffect(() => {
    if (isOpen) {
      if (saleToEdit) {
        setAmount(saleToEdit.amount.toString());
        setCategory(saleToEdit.category);
        setProductName(saleToEdit.product_name || ""); // Varsa ürün adını doldur
        setPaymentMethod(saleToEdit.payment_method || saleToEdit.paymentMethod);
      } else {
        setAmount('');
        setCategory('Tekstil');
        setProductName('');
        setPaymentMethod('Nakit');
      }
    }
  }, [isOpen, saleToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sadece PERDE seçiliyse ürün adını al, yoksa boş gönder
    const finalProductName = category === 'Perde' ? productName : "";

    onSave({
      amount: parseFloat(amount),
      category,
      productName: finalProductName, 
      paymentMethod,
      date: defaultDate, 
    });
    
    setAmount('');
    setProductName('');
    onClose();
  };

  const formattedDate = new Date(defaultDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden slide-in-from-bottom-4 duration-300">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {saleToEdit ? "Satışı Düzenle" : "Yeni Satış Ekle"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Seçili Tarih: <span className="text-indigo-500">{formattedDate}</span>
            </p>
          </div>
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
              <option value="Perde">Perde</option> {/* Sadece bu seçilince alt kutu açılacak */}
              <option value="Outlet">Outlet</option>
              <option value="Toptan">Toptan</option>
            </select>
          </div>

          {/* --- SADECE PERDE SEÇİLİRSE GÖRÜNEN KUTU --- */}
          {category === 'Perde' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block flex items-center gap-1">
                <ShoppingBag size={14} /> Perde Detayı / İsim
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Örn: Fon Perde, Ahmet Bey..."
                className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-indigo-900 dark:text-indigo-100 placeholder:text-indigo-300"
              />
            </div>
          )}

          {/* Ödeme Yöntemi */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Ödeme Yöntemi</label>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setPaymentMethod('Nakit')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'Nakit' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}><Banknote size={20} /><span className="font-medium text-xs">Nakit</span></button>
              <button type="button" onClick={() => setPaymentMethod('Kredi Kartı')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'Kredi Kartı' ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}><CreditCard size={20} /><span className="font-medium text-xs">Kredi Kartı</span></button>
              <button type="button" onClick={() => setPaymentMethod('Mail Order')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'Mail Order' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}><Globe size={20} /><span className="font-medium text-xs">Mail Order</span></button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all mt-2"
          >
            {saleToEdit ? "Güncellemeyi Kaydet" : "Satışı Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}