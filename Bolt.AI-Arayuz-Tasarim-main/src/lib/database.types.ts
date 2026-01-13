export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sales: {
        Row: {
          id: string
          sale_date: string
          category: 'Tekstil' | 'Perde'
          product_name: string
          payment_method: 'Nakit' | 'K.K.' | 'IBAN' | 'Mail Order'
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sale_date: string
          category: 'Tekstil' | 'Perde'
          product_name: string
          payment_method: 'Nakit' | 'K.K.' | 'IBAN' | 'Mail Order'
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sale_date?: string
          category?: 'Tekstil' | 'Perde'
          product_name?: string
          payment_method?: 'Nakit' | 'K.K.' | 'IBAN' | 'Mail Order'
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
