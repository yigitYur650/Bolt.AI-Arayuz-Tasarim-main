import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, LogIn } from 'lucide-react';
import toast from 'react-hot-toast'; 

// DİKKAT: 'export default' ifadesi burada olmak zorunda
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Giriş başarısız! Bilgilerini kontrol et.", {
        style: {
          background: '#ef4444', 
          color: '#fff',
        },
      });
    } else {
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...", {
        duration: 2000,
        style: {
           background: '#10b981', 
           color: '#fff'
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
          <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="text-amber-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Hoş Geldiniz</h1>
          <p className="text-slate-400 text-sm mt-2">Ciro Takip Sistemine Giriş Yapın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">E-Posta</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-slate-500" size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="admin@sirket.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">Şifre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-slate-500" size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
          >
            {loading ? "Kontrol Ediliyor..." : <><LogIn size={20} /> Giriş Yap</>}
          </button>

        </form>
      </div>
    </div>
  );
}