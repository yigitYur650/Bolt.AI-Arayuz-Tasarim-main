import { useState, useEffect, useCallback } from 'react';
import { Plus, LogOut, User, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast'; 

import DateScroller from './components/DateScroller';
import DashboardSummary from './components/DashboardSummary';
import TransactionList from './components/TransactionList';
import { AddSaleModal } from './components/AddSaleModal';
import ReportsPage from './components/ReportsPage';
import BottomNav from './components/BottomNav';
import LoginPage from './components/LoginPage';
import { api, supabase } from './lib/supabase';

interface Sale {
  id: number;
  amount: number;
  category: string;
  product_name: string;
  payment_method: string;
  date: string;
  created_at: string;
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<'sales' | 'reports'>('sales');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sales, setSales] = useState<Sale[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // OTURUM KONTROLÜ
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSales = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const data = await api.getSalesByDate(dateStr);
      setSales((data as any) || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      toast.error('Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, session]);

  useEffect(() => {
    if (session && activeTab === 'sales') {
      fetchSales();
    }
  }, [fetchSales, activeTab, session]);

  const handleEditSaleClick = (sale: Sale) => {
    setEditingSale(sale); 
    setIsModalOpen(true); 
  };

  const handleModalClose = () => {
    setEditingSale(null); 
    setIsModalOpen(false);
  };

  const handleSaveSale = async (saleData: any) => {
    // İşlemi Promise olarak tanımlıyoruz (Yükleniyor animasyonu için)
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        if (editingSale) {
          await api.updateSale(editingSale.id, saleData);
        } else {
          await api.createSale(saleData);
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    // Bildirimleri göster
    await toast.promise(savePromise, {
      loading: 'Kaydediliyor...',
      success: editingSale ? 'Satış başarıyla güncellendi! 🔄' : 'Yeni satış eklendi! 💰',
      error: 'Bir hata oluştu ❌',
    });

    // Başarılı olursa işlemleri tamamla
    handleModalClose();
    fetchSales();
  };

  const handleDeleteSale = async (id: number) => {
    if (!window.confirm("Bu satışı silmek istediğinize emin misiniz?")) return;
    
    try {
      await api.deleteSale(id);
      setSales(prevSales => prevSales.filter(sale => sale.id !== id));
      toast.success('Satış silindi 🗑️');
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error('Silinirken bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast('Çıkış yapıldı, görüşmek üzere! 👋', { icon: '🚪' });
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  // Giriş yapılmamışsa Login Sayfası
  if (!session) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#1e293b', color: '#fff' } }} />
        <LoginPage />
      </>
    );
  }

  // --- HESAPLAMALAR ---
  
  // 1. Nakit Toplamı
  const cashTotal = sales
    .filter(s => s.payment_method === 'Nakit')
    .reduce((sum, s) => sum + Number(s.amount), 0);

  // 2. Mail Order Toplamı (YENİ)
  const mailOrderTotal = sales
    .filter(s => s.payment_method === 'Mail Order')
    .reduce((sum, s) => sum + Number(s.amount), 0);

  // 3. Kart Toplamı (Nakit ve Mail Order olmayanlar)
  const cardTotal = sales
    .filter(s => s.payment_method !== 'Nakit' && s.payment_method !== 'Mail Order')
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div className="min-h-screen bg-black pb-20 relative">
      
      {/* Bildirim Kutusu */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
          },
        }} 
      />
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <LayoutDashboard className="text-slate-950" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">Ciro Takip</h1>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <User size={10} />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wide active:scale-95"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Çıkış Yap</span>
          <span className="sm:hidden">Çıkış</span>
        </button>
      </header>

      {activeTab === 'sales' ? (
        <>
          <div className="relative z-40">
            <DateScroller selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>
          
          {/* DashboardSummary'e yeni mailOrderTotal değerini gönderiyoruz */}
          <DashboardSummary 
            cashTotal={cashTotal} 
            cardTotal={cardTotal} 
            mailOrderTotal={mailOrderTotal}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : (
            <TransactionList sales={sales} onDelete={handleDeleteSale} onEdit={handleEditSaleClick} />
          )}

          <button
            onClick={() => {
              setEditingSale(null);
              setIsModalOpen(true);
            }}
            className="fixed bottom-24 right-6 z-30 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl shadow-amber-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-8 h-8 text-slate-950" strokeWidth={3} />
          </button>

          <AddSaleModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleSaveSale}
            defaultDate={format(selectedDate, 'yyyy-MM-dd')}
            saleToEdit={editingSale}
          />
        </>
      ) : (
        <ReportsPage />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;