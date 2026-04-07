'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity, DollarSign, Users, Zap, Camera, TrendingUp } from 'lucide-react';

// 🛡️ Conexión a la Matriz (Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Usamos la pública para el frontend por ahora
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GodModeDashboard() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [clientesSaaS, setClientesSaaS] = useState<any[]>([]);
  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    totalComisiones: 0,
    ventasHoy: 0,
  });

  useEffect(() => {
    async function fetchData() {
      // 1. Extraer Ventas
      const { data: dataVentas } = await supabase.from('ventas').select('*');
      if (dataVentas) {
        setVentas(dataVentas);
        const totalV = dataVentas.reduce((acc, v) => acc + Number(v.total), 0);
        const totalC = dataVentas.reduce((acc, v) => acc + Number(v.comision_vios), 0);
        setMetricas({ totalVentas: totalV, totalComisiones: totalC, ventasHoy: dataVentas.length });
      }

      // 2. Extraer Clientes SaaS (Límites de Espejos)
      const { data: dataClientes } = await supabase.from('clientes_saas').select('*');
      if (dataClientes) {
        setClientesSaaS(dataClientes);
      }
    }
    fetchData();
  }, []);

  // Formatear datos para la gráfica de barras (Ventas por tienda)
  const datosGraficaVentas = ventas.reduce((acc: any[], venta) => {
    const tienda = acc.find(t => t.name === venta.tienda_id);
    if (tienda) {
      tienda.total += Number(venta.total);
    } else {
      acc.push({ name: venta.tienda_id, total: Number(venta.total) });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10 font-sans text-zinc-900 selection:bg-cyan-400 selection:text-black">
      
      {/* HEADER NEÓN */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black flex items-center gap-3">
            <Zap className="text-cyan-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            ViOs Code <span className="font-light text-zinc-400">| God Mode</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase font-bold">Centro de Inteligencia Global</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg shadow-zinc-200/50 border border-zinc-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Sistemas Online</span>
        </div>
      </header>

      {/* TARJETAS DE MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Tarjeta 1: Total Transaccionado */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-fuchsia-500 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 bg-fuchsia-50 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:bg-fuchsia-100 transition-all"></div>
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-fuchsia-500" /> Volumen Ecosistema
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">${metricas.totalVentas.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">MXN procesados en todas las tiendas</p>
        </div>

        {/* Tarjeta 2: Tu Dinero (Comisiones) */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-cyan-400 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 bg-cyan-50 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:bg-cyan-100 transition-all"></div>
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-500" /> Revenue ViOs
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">${metricas.totalComisiones.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Comisiones generadas pendientes de cobro</p>
        </div>

        {/* Tarjeta 3: Transacciones */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-lime-400 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 bg-lime-50 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:bg-lime-100 transition-all"></div>
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-lime-500" /> Transacciones
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">{metricas.ventasHoy}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Ventas exitosas registradas en la Matriz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* GRÁFICA DE RENDIMIENTO (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl uppercase tracking-tighter text-black">Rendimiento por Marca</h3>
            <span className="text-xs bg-cyan-50 text-cyan-600 font-bold px-3 py-1 rounded-full uppercase tracking-widest">En Vivo</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGraficaVentas.length > 0 ? datosGraficaVentas : [{name: 'Sin datos', total: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#fafafa'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
                <Bar dataKey="total" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL SAAS: CONTROL DE ESPEJOS VIRTUALES */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl uppercase tracking-tighter text-black flex items-center gap-2">
              <Camera className="w-5 h-5 text-fuchsia-500" /> SaaS Paywalls
            </h3>
          </div>
          
          <div className="space-y-6 flex-1">
            {clientesSaaS.length === 0 ? (
              <p className="text-sm text-zinc-400 italic">Cargando ecosistemas conectados...</p>
            ) : (
              clientesSaaS.map((cliente) => {
                const porcentajeUso = (cliente.espejo_usos_mes_actual / cliente.limite_espejo_mensual) * 100;
                let colorBarra = 'bg-cyan-400';
                if (porcentajeUso > 75) colorBarra = 'bg-fuchsia-500';
                if (porcentajeUso >= 100) colorBarra = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';

                return (
                  <div key={cliente.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-800 group-hover:text-cyan-500 transition-colors">
                        {cliente.nombre_marca}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {cliente.espejo_usos_mes_actual} / {cliente.limite_espejo_mensual} usos
                      </span>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorBarra} transition-all duration-1000 ease-out`} 
                        style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <button className="w-full mt-6 py-4 bg-zinc-950 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            Gestionar Límites
          </button>
        </div>

      </div>
    </div>
  );
}