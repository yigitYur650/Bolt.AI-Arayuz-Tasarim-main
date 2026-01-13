import { createClient } from '@supabase/supabase-js';

// --- AYARLAR ---
// Kendi bilgilerini buraya yapıştır
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

interface ReportRow {
  amount: number | string | null;
  payment_method: string | null;
}

export const api = {

  // 1. Satışları Getir
  getSalesByDate: async (date: string) => {
    console.log("Veri çekiliyor:", date);
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('date', date) // Burası 'date' olmalı
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Veri çekme hatası:", error.message);
      return [];
    }
    return data || [];
  },

  // 2. Yeni Satış Ekle
  createSale: async (sale: SaleData) => {
    const today = new Date().toISOString().split('T')[0];
    const finalDate = sale.date || today; 
    
    const finalData = {
      date: finalDate, // Burası da 'date'
      category: sale.category,
      product_name: sale.productName || sale.product_name || "", 
      payment_method: sale.paymentMethod || sale.payment_method || "Nakit",
      amount: parseFloat(sale.amount.toString()) || 0 
    };

    const { data, error } = await supabase.from('sales').insert([finalData]).select().single();
    if (error) throw error;
    return data;
  },

  // 3. RAPOR (HATANIN KAYNAĞI BURASIYDI)
  getReport: async (startDate: string, endDate: string) => {
    console.log("Rapor İsteniyor:", startDate, endDate);
    
    const { data, error } = await supabase
      .from('sales')
      .select('amount, payment_method')
      .gte('date', startDate)  // <-- DİKKAT: Burada eskiden sale_date yazıyordu, 'date' yaptık.
      .lte('date', endDate);   // <-- DİKKAT: Burada eskiden sale_date yazıyordu, 'date' yaptık.

    if (error) {
      console.error("Rapor Hatası Detay:", error);
      throw error;
    }

    let total = 0;
    let cash = 0;
    let card = 0;

    if (data) {
      data.forEach((item: ReportRow) => {
        const amt = Number(item.amount) || 0;
        total += amt;
        
        if (item.payment_method === 'Nakit') {
          cash += amt;
        } else {
          card += amt;
        }
      });
    }
    
    return { total, cash, card };
  },

  // 4. Silme
  deleteSale: async (id: number) => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) throw error;
  }
};