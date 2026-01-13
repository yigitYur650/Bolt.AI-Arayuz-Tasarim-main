import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale'; // Türkçe tarih formatı için

import DateScroller from './components/DateScroller';
import DashboardSummary from './components/DashboardSummary';
import TransactionList from './components/TransactionList';
import { AddSaleModal } from './components/AddSaleModal'; // Süslü parantez ekledik
import ReportsPage from './components/ReportsPage';
import BottomNav from './components/BottomNav';
import { api } from './lib/supabase';

// Tip tanımını buraya alalım veya import edelim
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
  const [activeTab, setActiveTab] = useState<'sales' | 'reports'>('sales');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sales, setSales] = useState<Sale[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tarih değişince verileri çek
  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSales();
    }
  }, [selectedDate, activeTab]);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const data = await api.getSalesByDate(dateStr);
      setSales((data as any) || []); // Tip uyuşmazlığını önlemek için as any
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // EKSİK OLAN FONKSİYON BURASIYDI:
  const handleSaveSale = async (newSaleData: any) => {
    try {
      await api.createSale(newSaleData);
      setIsModalOpen(false); // Pencereyi kapat
      
      // Eğer eklenen tarih, şu an ekranda seçili olan tarihse listeyi yenile
      const formattedSelected = format(selectedDate, 'yyyy-MM-dd');
      if (newSaleData.date === formattedSelected) {
        fetchSales();
      } else {
        // Eğer başka bir güne eklediysek kullanıcıya bilgi verilebilir
        // alert("Satış seçilen tarihe eklendi.");
      }
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      alert("Satış kaydedilirken bir hata oluştu!");
    }
  };

  // Toplam Hesaplamaları
  const cashTotal = sales
    .filter(sale => sale.payment_method === 'Nakit')
    .reduce((sum, sale) => sum + Number(sale.amount), 0);

  // Nakit olmayan her şeyi (Kredi Kartı vs) Kart kabul et
  const cardTotal = sales
    .filter(sale => sale.payment_method !== 'Nakit')
    .reduce((sum, sale) => sum + Number(sale.amount), 0);

  return (
    <div className="min-h-screen bg-black pb-20"> {/* Alt menü için padding */}
      {activeTab === 'sales' ? (
        <>
          <DateScroller selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          
          <DashboardSummary cashTotal={cashTotal} cardTotal={cardTotal} />

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : (
            <TransactionList sales={sales} />
          )}

          {/* Ekle Butonu */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-24 right-6 z-30 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl shadow-amber-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-8 h-8 text-slate-950" strokeWidth={3} />
          </button>

          {/* Satış Ekleme Modalı */}
          <AddSaleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveSale}
            // DÜZELTME: Tarih Objesini String'e çevirip gönderiyoruz
            defaultDate={format(selectedDate, 'yyyy-MM-dd')} 
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