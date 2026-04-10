'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area // 👈 Nuevos componentes para la gráfica de tráfico
} from 'recharts';
import { 
  Activity, DollarSign, Zap, Camera, ShoppingCart, Filter, Eye, 
  ChevronRight, X, Package, Settings2, Save, MapPin, Calendar // 👈 Nuevos iconos
} from 'lucide-react';

// 🛡️ Conexión a la Matriz (Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GodModeDashboard() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [clientesSaaS, setClientesSaaS] = useState<any[]>([]);
  const [trafico, setTrafico] = useState<any[]>([]);
  const [filtroTienda, setFiltroTienda] = useState('TODAS');
  
  // 👁️ ESTADOS DE LOS MODALES
  const [modalIntentosAbierto, setModalIntentosAbierto] = useState(false);
  const [modalTraficoAbierto, setModalTraficoAbierto] = useState(false);

  // ⚙️ ESTADOS PARA LAS PALANCAS DE MANDO
  const [guardandoConfig, setGuardandoConfig] = useState(false);
  const [comisionActivaLocal, setComisionActivaLocal] = useState(false);
  const [porcentajeLocal, setPorcentajeLocal] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const { data: dataVentas } = await supabase.from('ventas').select('*');
      if (dataVentas) setVentas(dataVentas);

      const { data: dataClientes } = await supabase.from('clientes_saas').select('*');
      if (dataClientes) setClientesSaaS(dataClientes);

      const { data: dataTrafico } = await supabase.from('trafico_diario').select('*');
      if (dataTrafico) setTrafico(dataTrafico);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (filtroTienda !== 'TODAS') {
      const clienteSeleccionado = clientesSaaS.find(c => c.nombre_marca === filtroTienda);
      if (clienteSeleccionado) {
        setComisionActivaLocal(clienteSeleccionado.comision_activa || false);
        setPorcentajeLocal((clienteSeleccionado.porcentaje_comision_ventas || 0) * 100);
      }
    }
  }, [filtroTienda, clientesSaaS]);

  // 🧠 CEREBRO DEL DRILL-DOWN
  const ventasFiltradas = filtroTienda === 'TODAS' ? ventas : ventas.filter(v => v.tienda_id === filtroTienda);
  const traficoFiltrado = filtroTienda === 'TODAS' ? trafico : trafico.filter(t => t.tienda_id === filtroTienda);

  // 📊 SEPARACIÓN DE MÉTRICAS
  const totalVisitas = traficoFiltrado.length;
  const ventasReales = ventasFiltradas.filter(v => v.estado === 'completado' || v.estado === 'pagado');
  const intentosVenta = ventasFiltradas.filter(v => v.estado === 'intento_de_pago');

  const totalVolumenReal = ventasReales.reduce((acc, v) => acc + Number(v.total), 0);
  const totalComisionesReales = ventasReales.reduce((acc, v) => acc + Number(v.comision_vios), 0);
  const totalVolumenIntentos = intentosVenta.reduce((acc, v) => acc + Number(v.total), 0);

  const tiendasConVentas = ventas.map(v => v.tienda_id);
  const tiendasConTrafico = trafico.map(t => t.tienda_id);
  const tiendasDisponibles = ['TODAS', ...Array.from(new Set([...tiendasConVentas, ...tiendasConTrafico]))];

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

  // 🧮 NUEVO: Agrupar tráfico por Día para la Gráfica Mensual
  const datosGraficaTrafico = traficoFiltrado.reduce((acc: any[], visita: any) => {
    const fechaObj = new Date(visita.created_at || Date.now());
    const diaStr = fechaObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }); 
    
    const item = acc.find(t => t.name === diaStr);
    if (item) {
      item.visitas += 1;
    } else {
      acc.push({ name: diaStr, visitas: 1, timestamp: fechaObj.getTime() });
    }
    return acc;
  }, []).sort((a: any, b: any) => a.timestamp - b.timestamp); // Ordenar por fecha de forma ascendente

  // 📡 Agrupar tráfico por Tienda (Solo útil si ves "TODAS")
  const desgloseTrafico = Object.entries(
    traficoFiltrado.reduce((acc: any, visita: any) => {
      const tienda = visita.tienda_id || 'Desconocida';
      acc[tienda] = (acc[tienda] || 0) + 1;
      return acc;
    }, {})
  ).map(([nombre, cantidad]) => ({ nombre, cantidad })).sort((a: any, b: any) => b.cantidad - a.cantidad);

  // 📍 NUEVO: Agrupar tráfico por Ubicación (Ciudad, País)
  const desgloseUbicaciones = Object.entries(
    traficoFiltrado.reduce((acc: any, visita: any) => {
      const ubicacion = (visita.ciudad && visita.pais && visita.ciudad !== 'Desconocida') 
        ? `${visita.ciudad}, ${visita.pais}` 
        : 'Ubicación Oculta/Desconocida';
      acc[ubicacion] = (acc[ubicacion] || 0) + 1;
      return acc;
    }, {})
  ).map(([nombre, cantidad]) => ({ nombre, cantidad })).sort((a: any, b: any) => b.cantidad - a.cantidad);

  // 💾 FUNCIÓN PARA GUARDAR LAS PALANCAS
  const guardarConfiguracion = async () => {
    setGuardandoConfig(true);
    try {
      const { error } = await supabase
        .from('clientes_saas')
        .update({ 
          comision_activa: comisionActivaLocal, 
          porcentaje_comision_ventas: porcentajeLocal / 100 
        })
        .eq('nombre_marca', filtroTienda);

      if (error) throw error;
      
      setClientesSaaS(clientesSaaS.map(c => 
        c.nombre_marca === filtroTienda 
          ? { ...c, comision_activa: comisionActivaLocal, porcentaje_comision_ventas: porcentajeLocal / 100 } 
          : c
      ));
      
      alert("Configuración de ViOs guardada con éxito en la Matriz.");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setGuardandoConfig(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10 font-sans text-zinc-900 selection:bg-cyan-400 selection:text-black relative">
      
      {/* HEADER NEÓN */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black flex items-center gap-3">
            <Zap className="text-cyan-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            ViOs Code <span className="font-light text-zinc-400">| God Mode</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase font-bold">Centro de Inteligencia Global</p>
        </div>
        
        <div className="flex items-center gap-4">
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

      {/* 🎛️ PANEL DE CONTROL */}
      {filtroTienda !== 'TODAS' && (
        <div className="mb-10 bg-zinc-950 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-10 -top-10 bg-cyan-900 w-40 h-40 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 mb-1">
              <Settings2 className="w-6 h-6 text-cyan-400" />
              Palancas de Mando: <span className="text-cyan-400">{filtroTienda}</span>
            </h3>
            <p className="text-zinc-400 text-xs tracking-widest uppercase font-bold">Ajustes del motor de pagos y revenue</p>
          </div>

          <div className="relative z-10 flex items-center gap-8 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <span className={`text-xs font-black uppercase tracking-widest ${comisionActivaLocal ? 'text-green-400' : 'text-zinc-500'}`}>
                {comisionActivaLocal ? 'Comisión ON' : 'Comisión OFF'}
              </span>
              <button 
                onClick={() => setComisionActivaLocal(!comisionActivaLocal)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${comisionActivaLocal ? 'bg-green-500' : 'bg-zinc-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 ${comisionActivaLocal ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className={`transition-opacity duration-300 flex items-center gap-3 ${!comisionActivaLocal ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 flex items-center gap-2 focus-within:border-cyan-400 transition-colors">
                <input 
                  type="number" 
                  min="0" max="100" 
                  value={porcentajeLocal}
                  onChange={(e) => setPorcentajeLocal(Number(e.target.value))}
                  className="bg-transparent w-12 text-white font-black text-xl outline-none text-center"
                />
                <span className="text-cyan-400 font-black text-xl">%</span>
              </div>
            </div>

            <button 
              onClick={guardarConfiguracion}
              disabled={guardandoConfig}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
            >
              {guardandoConfig ? 'Guardando...' : <><Save className="w-4 h-4" /> Aplicar</>}
            </button>
          </div>
        </div>
      )}

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        
        {/* Tarjeta 1: Radar de Tráfico AHORA SIEMPRE INTERACTIVA */}
        <div 
          onClick={() => setModalTraficoAbierto(true)}
          className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-amber-400 relative overflow-hidden group cursor-pointer hover:bg-amber-50 transition-colors duration-300"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2 group-hover:text-amber-600 transition-colors">
              <Eye className="w-4 h-4 text-amber-500" /> Tráfico Radar
            </p>
            <ChevronRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-black">{totalVisitas.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Visitas detectadas {filtroTienda !== 'TODAS' ? `en ${filtroTienda}` : 'en ecosistema'}</p>
        </div>

        {/* Tarjeta 2: Intentos */}
        <div 
          onClick={() => setModalIntentosAbierto(true)}
          className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-fuchsia-500 relative overflow-hidden group cursor-pointer hover:bg-fuchsia-50 transition-colors duration-300"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2 group-hover:text-fuchsia-600 transition-colors">
              <ShoppingCart className="w-4 h-4 text-fuchsia-500" /> Intentos de Compra
            </p>
            <ChevronRight className="w-4 h-4 text-fuchsia-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-black">${totalVolumenIntentos.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">{intentosVenta.length} carritos abandonados</p>
        </div>

        {/* Tarjeta 3: Ventas */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-lime-400 relative overflow-hidden group">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-lime-500" /> Ventas Reales
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-black">${totalVolumenReal.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">{ventasReales.length} transacciones exitosas</p>
        </div>

        {/* Tarjeta 4: Revenue */}
        <div className="bg-zinc-950 p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 bg-cyan-900 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:bg-cyan-800 transition-all"></div>
          <p className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" /> Revenue ViOs
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">${totalComisionesReales.toLocaleString('es-MX')}</h2>
          <p className="text-[10px] text-zinc-400 mt-2">Garantizado para retiro</p>
        </div>
      </div>

      {/* GRÁFICAS Y PAYWALLS (IGUAL QUE ANTES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl uppercase tracking-tighter text-black">
              {filtroTienda === 'TODAS' ? 'Comparativa Financiera' : `Análisis de ${filtroTienda}`}
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGraficaVentas.length > 0 ? datosGraficaVentas : [{name: 'Sin datos', total: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{fill: '#fafafa'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                <Bar dataKey="total" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl uppercase tracking-tighter text-black flex items-center gap-2">
              <Camera className="w-5 h-5 text-fuchsia-500" /> SaaS Paywalls
            </h3>
          </div>
          <div className="space-y-6 flex-1">
            {clientesSaaS.length === 0 ? (
              <p className="text-sm text-zinc-400 italic">Cargando ecosistemas...</p>
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
                          <img src={cliente.logo_url} alt={cliente.nombre_marca} className="w-7 h-7 rounded-full object-cover border border-zinc-200 shadow-sm" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 shadow-sm"></div>
                        )}
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-800 group-hover:text-cyan-500 transition-colors">
                          {cliente.nombre_marca}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {tieneEspejo ? `${cliente.espejo_usos_mes_actual} / ${cliente.limite_espejo_mensual} usos` : 'SIN ESPEJO'}
                      </span>
                    </div>
                    {tieneEspejo ? (
                      <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colorBarra} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(porcentajeUso, 100)}%` }}></div>
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

      {/* 📡 MODAL MONSTRUOSO: RADAR DE TRÁFICO AVANZADO */}
      {modalTraficoAbierto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Lo hicimos más ancho (max-w-5xl) para que quepa la gráfica y las tablas */}
          <div className="bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
            
            {/* Header del Modal */}
            <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 shrink-0">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 flex items-center gap-3">
                  <Eye className="text-amber-500 w-6 h-6" /> 
                  Inteligencia de Tráfico
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">
                  Analítica en tiempo real para {filtroTienda !== 'TODAS' ? filtroTienda : 'todo el ecosistema'}
                </p>
              </div>
              <button onClick={() => setModalTraficoAbierto(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-full hover:bg-zinc-100 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Modal (Scrolleable) */}
            <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col gap-8">
              
              {/* 1. GRÁFICA DE FLUJO DE USUARIOS POR DÍA */}
              <div className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl p-6">
                <h3 className="font-black text-sm uppercase tracking-widest text-zinc-800 flex items-center gap-2 mb-6">
                  <Calendar className="w-4 h-4 text-amber-500" /> Flujo Mensual de Visitas
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={datosGraficaTrafico.length > 0 ? datosGraficaTrafico : [{name: 'Sin datos', visitas: 0}]}>
                      <defs>
                        <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="visitas" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. TABLAS DIVIDIDAS (Orígenes vs Ubicaciones) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Columna Izquierda: Páginas Más Visitadas (Solo visible si estás en TODAS) */}
                {filtroTienda === 'TODAS' && (
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-zinc-800 flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-cyan-500" /> Tráfico por Ecosistema
                    </h3>
                    <div className="space-y-3">
                      {desgloseTrafico.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No hay datos suficientes.</p>
                      ) : (
                        desgloseTrafico.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center border border-zinc-100 rounded-2xl p-4 bg-white shadow-sm">
                            <span className="text-xs font-black uppercase text-zinc-700">{item.nombre}</span>
                            <span className="text-lg font-black text-cyan-500">{item.cantidad} <span className="text-[9px] text-zinc-400 uppercase">visitas</span></span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Columna Derecha: GEOLOCALIZACIÓN GPS */}
                <div className={filtroTienda !== 'TODAS' ? 'md:col-span-2' : ''}>
                  <h3 className="font-black text-sm uppercase tracking-widest text-zinc-800 flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-fuchsia-500" /> Radar de Ubicaciones
                  </h3>
                  <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
                    {desgloseUbicaciones.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">Aún no hay conexiones GPS registradas.</p>
                    ) : (
                      desgloseUbicaciones.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center border border-zinc-100 rounded-2xl p-4 bg-zinc-50 shadow-sm hover:border-fuchsia-300 transition-colors">
                          <span className="text-xs font-bold text-zinc-600 line-clamp-1 pr-2">{item.nombre}</span>
                          <span className="text-lg font-black text-fuchsia-500 whitespace-nowrap">{item.cantidad} <span className="text-[9px] text-zinc-400 uppercase">visitas</span></span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 MODAL: RAYOS X DE CARRITOS ABANDONADOS (IGUAL QUE ANTES) */}
      {modalIntentosAbierto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
            <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 flex items-center gap-3">
                  <ShoppingCart className="text-fuchsia-500 w-6 h-6" /> 
                  Rayos X: Carritos Abandonados
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">
                  {intentosVenta.length} intentos detectados {filtroTienda !== 'TODAS' ? `en ${filtroTienda}` : 'en el ecosistema'}
                </p>
              </div>
              <button onClick={() => setModalIntentosAbierto(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-full hover:bg-zinc-100 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-white space-y-6">
              {intentosVenta.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <Package className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No hay carritos abandonados aquí</p>
                </div>
              ) : (
                intentosVenta.map((intento, idx) => {
                  let articulos = [];
                  if (intento.carrito) articulos = typeof intento.carrito === 'string' ? JSON.parse(intento.carrito) : intento.carrito;
                  return (
                    <div key={intento.id || idx} className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 hover:border-fuchsia-300 transition-colors">
                      <div className="flex justify-between items-start mb-4 border-b border-zinc-200 pb-4">
                        <div>
                          <span className="bg-zinc-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{intento.tienda_id}</span>
                          <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-wider">Fecha: {new Date(intento.created_at || Date.now()).toLocaleString('es-MX')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Total Abandonado</p>
                          <p className="text-xl font-black text-fuchsia-600">${Number(intento.total).toLocaleString('es-MX')}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {articulos.length > 0 ? (
                          articulos.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                              <div className="flex items-center gap-3">
                                {item.imagen ? <img src={item.imagen} alt={item.nombre} className="w-10 h-10 rounded-md object-cover border border-zinc-100" /> : <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center"><Package className="w-4 h-4 text-zinc-300" /></div>}
                                <div>
                                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{item.marca || 'Producto'}</p>
                                  <p className="text-sm font-bold text-zinc-800 line-clamp-1">{item.nombre || item.nombreEs}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-zinc-900">${(Number(item.precio) || 0).toLocaleString('es-MX')}</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Cant: {item.cantidad || 1}</p>
                              </div>
                            </div>
                          ))
                        ) : <p className="text-xs text-zinc-400 italic">Los detalles de los artículos no fueron guardados.</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}