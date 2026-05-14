'use client';

import { useState } from 'react';
import { supabaseKetzzal } from '@/lib/supabase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Iniciar Sesión
        const { error } = await supabaseKetzzal.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        setMessage({ text: '¡Acceso concedido! Redirigiendo...', type: 'success' });
        // Aquí luego redirigiremos al dashboard del inversor
        setTimeout(() => window.location.href = '/ketzzal', 1500);

      } else {
        // Crear Cuenta
        const { error } = await supabaseKetzzal.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setMessage({ text: '¡Cuenta creada con éxito! Iniciando sesión...', type: 'success' });
        setTimeout(() => window.location.href = '/ketzzal', 1500);
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Ocurrió un error en la autenticación.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Círculo decorativo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e63946] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#110909] border border-red-900/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-2">
            ViOs <span className="text-[#d4af37]">ID</span>
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            {isLogin ? 'Acceso a tu Portafolio RWA' : 'Únete al Fondo Gastronómico'}
          </p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold text-center border ${
            message.type === 'error' 
              ? 'bg-red-950/50 border-red-900 text-red-400' 
              : 'bg-emerald-950/50 border-emerald-900 text-emerald-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="inversor@ejemplo.com"
              className="w-full bg-[#0a0505] border border-red-900/40 rounded-xl p-4 text-white focus:outline-none focus:border-[#e63946] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-2">Contraseña (Bóveda Segura)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0505] border border-red-900/40 rounded-xl p-4 text-white focus:outline-none focus:border-[#e63946] transition-colors tracking-widest"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-white text-[#990000] text-sm font-black rounded-xl hover:bg-[#e63946] hover:text-white transition-all transform active:scale-95 shadow-[0_10px_20px_rgba(230,57,70,0.1)] disabled:opacity-50"
          >
            {loading ? 'DESENCRIPTANDO...' : (isLogin ? 'ACCEDER A LA BÓVEDA' : 'GENERAR LLAVES DE INVERSOR')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Registra tu perfil aquí' : '¿Ya eres inversor? Inicia sesión'}
          </button>
        </div>

      </div>
    </div>
  );
}