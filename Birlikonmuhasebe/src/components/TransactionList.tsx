import { Edit2, Trash2, ArrowDownRight } from 'lucide-react';

interface Sale {
  id: number;
  amount: number;
  category: string;
  product_name: string;
  payment_method: string;
  date: string;
  created_at: string; 
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
        <div className="bg-slate-900 p-4 rounded-full mb-3">
          <ArrowDownRight size={32} strokeWidth={1.5} />
        </div>
        <p>Henüz bu tarihte işlem yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24 px-4">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2">İşlem Geçmişi</h3>
      
      {sales.map((sale) => (
        <div key={sale.id} className="group bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
          
          <div className="flex items-center gap-4">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
              ${sale.payment_method === 'Nakit' ? 'bg-emerald-500/10 text-emerald-500' : 
                sale.payment_method === 'Mail Order' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}
            `}>
              {sale.payment_method === 'Nakit' ? '₺' : sale.payment_method === 'Mail Order' ? 'M' : 'K'}
            </div>

            <div>
              <p className="text-white font-bold text-lg">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(sale.amount)}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-300">{sale.category}</span>
                <span>•</span>
                <span>{sale.product_name || 'Ürün yok'}</span>
                <span>•</span>
                <span>{sale.payment_method}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(sale)}
              className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(sale.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}