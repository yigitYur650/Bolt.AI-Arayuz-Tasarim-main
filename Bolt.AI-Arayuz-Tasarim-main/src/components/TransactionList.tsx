import { Trash2, CreditCard, Banknote, Globe, Pencil } from 'lucide-react';

interface Sale {
  id: number;
  amount: number;
  category: string;
  product_name?: string; // Bu alan artık önemli
  payment_method: string;
  date: string;
}

interface TransactionListProps {
  sales: Sale[];
  onDelete: (id: number) => void;
  onEdit: (sale: Sale) => void;
}

export default function TransactionList({ sales, onDelete, onEdit }: TransactionListProps) {
  
  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <p>Bu tarihte henüz satış yok.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 space-y-3">
      {sales.map((sale) => (
        <div 
          key={sale.id} 
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              sale.payment_method === 'Nakit' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : sale.payment_method === 'Mail Order'
                ? 'bg-blue-500/10 text-blue-500'
                : 'bg-purple-500/10 text-purple-500'
            }`}>
              {sale.payment_method === 'Nakit' ? <Banknote size={20} /> : 
               sale.payment_method === 'Mail Order' ? <Globe size={20} /> : <CreditCard size={20} />}
            </div>

            <div>
              <p className="font-bold text-white text-lg">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(sale.amount))}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {/* DÜZELTME: İsim varsa ismi, yoksa kategoriyi yaz */}
                <span className="font-medium text-slate-300">
                  {sale.product_name ? sale.product_name : sale.category}
                </span>
                <span>•</span>
                <span>{sale.payment_method}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(sale)}
              className="p-2 text-slate-600 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors"
            >
              <Pencil size={18} />
            </button>

            <button 
              onClick={() => onDelete(sale.id)}
              className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}