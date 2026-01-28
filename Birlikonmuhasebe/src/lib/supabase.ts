import { createClient } from '@supabase/supabase-js';

// --- AYARLAR ---
const supabaseUrl = "https://rvkprveygmgikevocxle.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2a3BydmV5Z21naWtldm9jeGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjQ0OTMsImV4cCI6MjA4MzkwMDQ5M30.EZ_My8jEZjRiaLJlAdkWjuY2r3d0p8OuChVJUxVsZJc";

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- TİP TANIMLAMALARI ---
interface SaleData {
  date?: string;
  category: string;
  productName?: string;
  product_name?: string;
  paymentMethod?: string;
  payment_method?: string;
  amount: number | string;
}

export const api = {

  // 1. Satışları Getir
  getSalesByDate: async (date: string) => {
    // RLS açık olduğu için sadece giriş yapanın verileri gelir. Filtreye gerek yok.
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Veri çekme hatası:", error.message);
      return [];
    }
    return data || [];
  },

  // 2. Yeni Satış Ekle (SADELEŞTİRİLDİ)
  createSale: async (sale: SaleData) => {
    // user_id göndermiyoruz, veritabanı otomatik ekleyecek.
    const today = new Date().toISOString().split('T')[0];
    const finalDate = sale.date || today; 
    
    const finalData = {
      date: finalDate,
      category: sale.category,
      product_name: sale.productName || sale.product_name || "", 
      payment_method: sale.paymentMethod || sale.payment_method || "Nakit",
      amount: parseFloat(sale.amount.toString()) || 0
      // user_id satırını sildik, veritabanı halledecek!
    };

    const { data, error } = await supabase.from('sales').insert([finalData]).select().single();
    if (error) throw error;
    return data;
  },

  // 3. RAPOR
  getReport: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('sales')
      .select('amount, payment_method, category, product_name') 
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error("Rapor Hatası Detay:", error);
      throw error;
    }
    
    return data || [];
  },

  // 4. Silme
  deleteSale: async (id: number) => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) throw error;
  },

  // 5. Güncelleme
  updateSale: async (id: number, sale: SaleData) => {
    const finalData = {
      category: sale.category,
      product_name: sale.productName || sale.product_name || "", 
      payment_method: sale.paymentMethod || sale.payment_method || "Nakit",
      amount: parseFloat(sale.amount.toString()) || 0
    };

    const { data, error } = await supabase
      .from('sales')
      .update(finalData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};