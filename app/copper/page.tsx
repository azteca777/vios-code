'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CopperBatch {
  id: string;
  batch_name: string;
  grade: string;
  target_funding_mxn: number;
  current_funding_mxn: number;
  status: string;
  expected_yield_percentage: number;
  token_price_mxn: number;
}

export default function CopperMarketplace() {
  const [batches, setBatches] = useState<CopperBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(1000);
  const [tier, setTier] = useState<'Gema' | 'Rubí' | 'Diamante'>('Gema');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Multiplicadores de gamificación (esto se puede ajustar después)
  const tierBonuses = { Gema: 0, Rubí: 2, Diamante: 5 };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, []);

  // Observador: Cambia el nivel automáticamente según el monto a invertir
  useEffect(() => {
    if (amount < 50000) {
      setTier('Gema');
    } else if (amount >= 50000 && amount < 200000) {
      setTier('Rubí');
    } else {
      setTier('Diamante');
    }
  }, [amount]);

    // ... tu código sigue igual aquí abajo

  async function fetchBatches() {
    const { data, error } = await supabase
      .from('copper_batches')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setBatches(data || []);
    setLoading(false);
  }

  const handleInvest = async (batch: CopperBatch) => {
    setProcessingId(batch.id);
    try {
      const newFunding = batch.current_funding_mxn + amount;
      if (newFunding > batch.target_funding_mxn) {
        alert('La cantidad excede la meta del lote.');
        return;
      }

      const { error } = await supabase
        .from('copper_batches')
        .update({ current_funding_mxn: newFunding })
        .eq('id', batch.id);

      if (error) throw error;
      
      setBatches(batches.map(b => b.id === batch.id ? { ...b, current_funding_mxn: newFunding } : b));
      alert(`Inversión exitosa: Has adquirido ${(amount / batch.token_price_mxn).toFixed(2)} Tokens.`);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#b87333] font-mono">INICIALIZANDO PROTOCOLO RWA...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e4e2] p-6 lg:p-12 font-sans">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#f5f5f5] to-[#a1a1a1]">
            ViOs RWA <span className="text-[#b87333]">V2</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm italic">Terminal de Activos de Cobre</p>
        </div>
        
        {/* Indicador Automático de Gamificación */}
        <div className="bg-[#111] p-1 rounded-2xl border border-gray-800 flex gap-2">
          {['Gema', 'Rubí', 'Diamante'].map((t) => (
            <div 
              key={t}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-500 flex items-center gap-2 ${
                tier === t 
                  ? 'bg-[#b87333] text-black shadow-[0_0_20px_rgba(184,115,51,0.5)] scale-105' 
                  : 'bg-transparent text-gray-600 opacity-50'
              }`}
            >
              {tier === t && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
              {t}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12">
        {batches.map((batch) => {
          const tokens = amount / batch.token_price_mxn;
          const totalYield = batch.expected_yield_percentage + tierBonuses[tier];
          const estimatedProfit = amount * (totalYield / 100);
          const progress = (batch.current_funding_mxn / batch.target_funding_mxn) * 100;

          return (
            <div key={batch.id} className="relative group">
              {/* Card Moderno */}
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:border-[#b87333]/50 shadow-2xl">
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{batch.batch_name}</h2>
                    <p className="text-[#b87333] font-mono text-sm uppercase tracking-tighter mt-1">{batch.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Rendimiento Total</p>
                    <p className="text-3xl font-bold text-emerald-400">+{totalYield}%</p>
                  </div>
                </div>

                {/* Simulador Integrado */}
                <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 mb-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Cantidad a Invertir (MXN)</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-transparent text-2xl font-bold text-white outline-none w-full border-b border-gray-800 focus:border-[#b87333] transition-colors"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Tokens a recibir</p>
                      <p className="text-2xl font-bold text-white">{tokens.toFixed(2)} <span className="text-xs text-gray-500">Cu</span></p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-white/5">
                    <span className="text-sm text-gray-400 italic">Ganancia estimada con gamificación:</span>
                    <span className="text-xl font-bold text-emerald-400">${estimatedProfit.toLocaleString()} MXN</span>
                  </div>
                </div>

                {/* Barra de Progreso Minimalista */}
                <div className="space-y-3 mb-10">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span className="text-gray-500">Fondeo Actual</span>
                    <span className="text-white">{progress.toFixed(2)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#b87333] via-[#e5e4e2] to-[#b87333] transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleInvest(batch)}
                  disabled={processingId === batch.id}
                  className="w-full py-5 bg-white text-black text-lg font-black rounded-2xl hover:bg-[#b87333] hover:text-white transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                >
                  {processingId === batch.id ? 'VERIFICANDO EN BLOCKCHAIN...' : 'EJECUTAR INVERSIÓN'}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}