'use client';

import { useEffect, useState } from 'react';
import { supabaseKetzzal } from '@/lib/supabase';
import Image from 'next/image';

interface BatchUpdate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

interface KetzzalBatch {
  id: string;
  batch_name: string;
  description: string;
  sku_reference: string;
  target_capital: number;
  current_capital: number;
  status: string;
  base_yield_percentage: number;
  habanero_bonus_yield: number;
  scorpion_bonus_yield: number;
  token_price: number;
  updates?: BatchUpdate[];
}

export default function KetzzalMarketplace() {
  const [batches, setBatches] = useState<KetzzalBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(1000);
  const [tier, setTier] = useState<'Serrano' | 'Habanero' | 'Escorpión'>('Serrano');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatchesAndUpdates = async () => {
      // 1. Traer los lotes
      const { data: batchesData, error: batchesError } = await supabaseKetzzal
        .from('ketzzal_batches')
        .select('*')
        .eq('status', 'funding');

      if (batchesError) {
        console.error('Error lotes:', batchesError);
        return;
      }

      // 2. Traer la trazabilidad (actualizaciones)
      const { data: updatesData, error: updatesError } = await supabaseKetzzal
        .from('ketzzal_batch_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (updatesError) {
        console.error('Error trazabilidad:', updatesError);
      }

      // 3. Unir los datos
      if (batchesData) {
        const combinedBatches = batchesData.map(batch => ({
          ...batch,
          updates: updatesData ? updatesData.filter(u => u.batch_id === batch.id) : []
        }));
        setBatches(combinedBatches);
      }
      setLoading(false);
    };

    fetchBatchesAndUpdates();
  }, []);

  useEffect(() => {
    if (amount < 25000) {
      setTier('Serrano');
    } else if (amount >= 25000 && amount < 100000) {
      setTier('Habanero');
    } else {
      setTier('Escorpión');
    }
  }, [amount]);

  const handleInvest = async (batch: KetzzalBatch) => {
    setProcessingId(batch.id);
    setTimeout(() => {
      alert(`¡Inversión exitosa! Has adquirido ${(amount / batch.token_price).toFixed(2)} Tokens del ${batch.batch_name}.`);
      setProcessingId(null);
    }, 1500);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0505] flex items-center justify-center text-[#e63946] font-bold text-2xl animate-pulse">Calentando los comales...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0505] text-[#f5e6e6] p-6 lg:p-12 font-sans">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#ffcfcf] to-[#e63946]">
            Salsas Ketzzal <span className="text-[#d4af37]">RWA</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium uppercase tracking-widest text-sm italic">Fondo de Producción Gastronómica</p>
        </div>
        
        <div className="bg-[#1a0f0f] p-1 rounded-2xl border border-red-900/30 flex gap-2">
          {(['Serrano', 'Habanero', 'Escorpión'] as const).map((t) => (
            <div 
              key={t}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-500 flex items-center gap-2 ${
                tier === t 
                  ? 'bg-[#e63946] text-white shadow-[0_0_20px_rgba(230,57,70,0.5)] scale-105' 
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
          const tokens = amount / batch.token_price;
          let bonusYield = 0;
          if (tier === 'Habanero') bonusYield = batch.habanero_bonus_yield;
          if (tier === 'Escorpión') bonusYield = batch.scorpion_bonus_yield;
          const totalYield = batch.base_yield_percentage + bonusYield;
          const estimatedProfit = amount * (totalYield / 100);
          const progress = (batch.current_capital / batch.target_capital) * 100;

          return (
            <div key={batch.id} className="relative group">
              <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0a0505] border border-red-900/40 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:border-[#e63946]/50 shadow-2xl">
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{batch.batch_name}</h2>
                    <p className="text-[#d4af37] font-mono text-sm uppercase tracking-tighter mt-1">{batch.sku_reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Rendimiento Total</p>
                    <p className="text-3xl font-bold text-emerald-400">+{totalYield}%</p>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 mb-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Inversión (MXN)</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-transparent text-2xl font-bold text-white outline-none w-full border-b border-red-900 focus:border-[#e63946] transition-colors"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Tokens a recibir</p>
                      <p className="text-2xl font-bold text-white">{tokens.toFixed(2)} <span className="text-xs text-gray-500">TKZ</span></p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-white/5">
                    <span className="text-sm text-gray-400 italic">Retorno estimado:</span>
                    <span className="text-xl font-bold text-emerald-400">${(amount + estimatedProfit).toLocaleString('es-MX')} MXN</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleInvest(batch)}
                  disabled={processingId === batch.id}
                  className="w-full py-5 mb-10 bg-white text-[#990000] text-lg font-black rounded-2xl hover:bg-[#e63946] hover:text-white transition-all shadow-[0_20px_40px_rgba(230,57,70,0.1)]"
                >
                  {processingId === batch.id ? 'FIRMANDO...' : 'FINANCIAR LOTE KETZZAL'}
                </button>

                {/* SECCIÓN DE TRAZABILIDAD (NUEVO) */}
                <div className="mt-8 border-t border-red-900/30 pt-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Prueba de Producción (Trazabilidad)</h3>
                  
                  {batch.updates && batch.updates.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-red-900/50 before:to-transparent">
                      {batch.updates.map((update) => (
                        <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#e63946] bg-[#0a0505] text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(230,57,70,0.8)]"></div>
                          
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-[#110909] border border-red-900/30 p-4 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-[#f5e6e6] text-sm">{update.title}</h4>
                              <time className="text-[10px] text-[#d4af37] font-mono">{new Date(update.created_at).toLocaleDateString('es-MX')}</time>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">{update.description}</p>
                            {update.image_url && (
                              <img 
                                src={update.image_url} 
                                alt={update.title} 
                                className="w-full h-32 object-cover rounded-lg border border-white/5 opacity-80 hover:opacity-100 transition-opacity"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center">Fondeo activo. La producción comenzará pronto.</p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}