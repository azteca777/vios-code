'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, DollarSign, Zap, Camera, ShoppingCart, Filter, Eye } from 'lucide-react';

// 🛡️ Conexión a la Matriz (Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GodModeDashboard() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [clientesSaaS, setClientesSaaS] = useState<any[]>([]);
  const [trafico, setTrafico] = useState<any[]>([]);
  const [filtroTienda, setFiltroTienda] = useState('TODAS');

  useEffect(() => {
    async function fetchData() {
      // 1. Traer Ventas
      const { data: dataVentas } = await supabase.from('ventas').select('*');
      if (dataVentas) setVentas(dataVentas);

      // 2. Traer Clientes SaaS
      const { data: dataClientes } = await supabase.from('clientes_saas').select('*');
      if (dataClientes) setClientesSaaS(dataClientes);

      // 3. Traer Tráfico del Radar
      const { data: dataTrafico } = await supabase.from('trafico_diario').select('*');
      if (dataTrafico) setTrafico(dataTrafico);
    }
    fetchData();
  }, []);

  // 🧠 CEREBRO DEL DRILL-DOWN: Filtrar según lo que elijas en el menú
  const ventasFiltradas = filtroTienda === 'TODAS' 
    ? ventas 
    : ventas.filter(v => v.tienda_id === filtroTienda);

  const traficoFiltrado = filtroTienda === 'TODAS'
    ? trafico
    : trafico.filter(t => t.tienda_id === filtroTienda);

  // 📊 SEPARACIÓN DE MÉTRICAS
  const totalVisitas = traficoFiltrado.length;
  
  const ventasReales = ventasFiltradas.filter(v => v.estado === 'completado' || v.estado === 'pagado');
  const intentosVenta = ventasFiltradas.filter(v => v.estado === 'intento_de_pago');

  const totalVolumenReal = ventasReales.reduce((acc, v) => acc + Number(v.total), 0);
  const totalComisionesReales = ventasReales.reduce((acc, v) => acc + Number(v.comision_vios), 0);
  const totalVolumenIntentos = intentosVenta.reduce((acc, v) => acc + Number(v.total), 0);

  // Obtener lista única de tiendas combinando las que tienen ventas y las que tienen tráfico
  const tiendasConVentas = ventas.map(v => v.tienda_id);
  const tiendasConTrafico = trafico.map(t => t.tienda_id);
  const tiendasDisponibles = ['TODAS', ...Array.from(new Set([...tiendasConVentas, ...tiendasConTrafico]))];

  // Datos para la gráfica
  const datosGraficaVentas = ventasFiltradas.reduce((acc: any[], venta) => {
    const etiqueta = filtroTienda === 'TODAS' ? venta.tienda_id : venta.estado;
    const item = acc.find(t => t.name === etiqueta);
    if (item) {
      item.total += Number(venta.total);
    } else {
      acc.push({ name: etiqueta, total: Number(venta.total) });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10 font-sans text-zinc-900 selection:bg-cyan-400 selection:text-black">
      
      {/* HEADER NEÓN CON SELECTOR DE TIENDA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black flex items-center gap-3">
            <Zap className="text-cyan-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            ViOs Code <span className="font-light text-zinc-400">| God Mode</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase font-bold">Centro de Inteligencia Global</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* SELECTOR DE TIENDAS */}
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-zinc-200">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select 
              className="bg-transparent text-sm font-bold uppercase tracking-wider text-zinc-800 outline-none cursor-pointer"
              value={filtroTienda}
              onChange={(e) => setFiltroTienda(e.target.value)}
            >
              {tiendasDisponibles.map(tienda => (
                <option key={tienda} value={tienda}>{tienda}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg shadow-zinc-200/50 border border-zinc-100">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">En Vivo</span>
          </div>
        </div>
      </header>

      {/* TARJETAS DE MÉTRICAS (EL EMBUDO DE 4 PASOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        
        {/* Tarjeta 1: Radar de Tráfico */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-amber-400 relative overflow-hidden group">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-amber-500" /> Tráfico Radar
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">{totalVisitas.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Visitas detectadas en ecosistema</p>
        </div>

        {/* Tarjeta 2: Intentos / Carritos Abandonados */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-fuchsia-500 relative overflow-hidden group">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-fuchsia-500" /> Intentos de Compra
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">${totalVolumenIntentos.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">{intentosVenta.length} carritos abandonados</p>
        </div>

        {/* Tarjeta 3: Total Real */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-lime-400 relative overflow-hidden group">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-lime-500" /> Ventas Reales
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">${totalVolumenReal.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">{ventasReales.length} transacciones exitosas</p>
        </div>

        {/* Tarjeta 4: Tu Dinero (Comisiones) */}
        <div className="bg-zinc-950 p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 bg-cyan-900 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:bg-cyan-800 transition-all"></div>
          <p className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" /> Revenue ViOs
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">${totalComisionesReales.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Garantizado para retiro</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* GRÁFICA DINÁMICA */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl uppercase tracking-tighter text-black">
              {filtroTienda === 'TODAS' ? 'Comparativa de Ecosistemas' : `Análisis de ${filtroTienda}`}
            </h3>
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

        {/* PANEL SAAS */}
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
                const tieneEspejo = cliente.limite_espejo_mensual > 0;
                const porcentajeUso = tieneEspejo ? (cliente.espejo_usos_mes_actual / cliente.limite_espejo_mensual) * 100 : 0;
                
                let colorBarra = 'bg-cyan-400';
                if (porcentajeUso > 75) colorBarra = 'bg-fuchsia-500';
                if (porcentajeUso >= 100) colorBarra = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';

                return (
                  <div key={cliente.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        {cliente.logo_url ? (
                          <img 
                            src={cliente.logo_url} 
                            alt={cliente.nombre_marca} 
                            className="w-7 h-7 rounded-full object-cover border border-zinc-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 shadow-sm"></div>
                        )}
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-800 group-hover:text-cyan-500 transition-colors">
                          {cliente.nombre_marca}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {tieneEspejo ? `${cliente.espejo_usos_mes_actual} / ${cliente.limite_espejo_mensual} usos` : 'SIN ESPEJO AR'}
                      </span>
                    </div>
                    {tieneEspejo ? (
                      <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colorBarra} transition-all duration-1000 ease-out`} 
                          style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                        ></div>
                      </div>
                    ) : (
                      <div className="w-full h-2.5 bg-zinc-50 border border-zinc-100 rounded-full overflow-hidden flex items-center justify-center mt-1">
                         <span className="text-[8px] tracking-[0.2em] text-zinc-300 font-bold">N/A</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <button className="mt-8 w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-800 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]">
            Gestionar Límites
          </button>
          
        </div>

      </div>
    </div>
  );
}