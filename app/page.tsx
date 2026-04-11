'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import SensorTrafico from './components/SensorTrafico';
import { 
  Activity, DollarSign, Zap, Camera, ShoppingCart, Filter, Eye, 
  ChevronRight, X, Package, Settings2, Save, Check, FileText, Lock, ArrowRight, Key 
} from 'lucide-react';

// 🛡️ Conexión a la Matriz (Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ViosCodeMatriz() {
  const [idioma, setIdioma] = useState('es');
  const router = useRouter();
  
  // ⚙️ ESTADOS PARA EL FLUJO DE COMPRA
  const [planSeleccionado, setPlanSeleccionado] = useState<any>(null);
  const [pasoCompra, setPasoCompra] = useState(0); 
  const [datosCliente, setDatosCliente] = useState({
    nombre: '', email: '', nombreNegocio: '', telefono: '', duracionContrato: '3'
  });

  const [codigoAcceso, setCodigoAcceso] = useState('');

  // 🔐 ESTADOS PARA GOD MODE ACCESS
  const [modalAdminAbierto, setModalAdminAbierto] = useState(false);
  const [adminEmail, setAdminEmail] = useState('xkript@hotmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [cargandoAdmin, setCargandoAdmin] = useState(false);
  const [errorAdmin, setErrorAdmin] = useState('');
  const [isCrearCuenta, setIsCrearCuenta] = useState(false); 

  // 💎 PLANES OFICIALES - REDISEÑADOS CON ESTILOS "NEÓN Y PREMIUM"
  const planes = [
    { 
      id: 'flex', 
      nombre: 'Plan Flex', 
      precio: 100, 
      borderGrad: 'bg-gradient-to-br from-purple-600 via-fuchsia-500 to-purple-900', // Morado Eléctrico
      glow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]',
      titleHover: 'group-hover:text-fuchsia-400',
      desc: 'Toda la base tecnológica activa y cobrando por ti (Esquema por comisión).' 
    },
    { 
      id: 'basico', 
      nombre: 'Plan Básico', 
      precio: 200, 
      borderGrad: 'bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-900', // Azul Eléctrico
      glow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]',
      titleHover: 'group-hover:text-cyan-400',
      desc: 'Toda la base tecnológica + 3 días de pautas publicitarias en Meta Ads al mes.' 
    },
    { 
      id: 'clasico', 
      nombre: 'Plan Clásico', 
      precio: 499, 
      borderGrad: 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-900', // Verde Eléctrico
      glow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]',
      titleHover: 'group-hover:text-emerald-400',
      desc: '0% Comisión. Incluye WhatsApp bot, Panel BI + 3 días de pautas en Meta Ads al mes.' 
    },
    { 
      id: 'premium', 
      nombre: 'Plan Premium', 
      precio: 599, 
      borderGrad: 'bg-gradient-to-br from-gray-300 via-zinc-100 to-gray-600', // Plata Metalizado
      glow: 'hover:shadow-[0_0_40px_rgba(209,213,219,0.3)]',
      titleHover: 'group-hover:text-gray-300',
      desc: '0% Comisión. WhatsApp bot, Panel BI + 5 días de pautas en Meta Ads de alto valor.' 
    },
    { 
      id: 'gold', 
      nombre: 'Plan Gold', 
      precio: 799, 
      borderGrad: 'bg-gradient-to-br from-yellow-500 via-[#d4af37] to-amber-700', // Oro
      glow: 'hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]',
      titleHover: 'group-hover:text-[#d4af37]',
      desc: '0% Comisión. Toda la automatización + 15 días de pautas en Meta Ads.' 
    },
    { 
      id: 'diamond', 
      nombre: 'Plan Diamond', 
      precio: 999, 
      borderGrad: 'bg-gradient-to-tr from-cyan-300 via-white to-fuchsia-300', // Iridescente Diamante
      glow: 'hover:shadow-[0_0_60px_rgba(103,232,249,0.6)]',
      titleHover: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300', // Letras de diamante permanentes
      isDiamond: true, // Bandera especial para animaciones
      desc: '0% Comisión. Toda la automatización + 20 días de pautas en Meta Ads. El ecosistema definitivo.' 
    },
  ];

  const BotonIdioma = () => (
    <button 
      onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')} 
      className="flex items-center gap-2 px-6 py-2 border border-[#d4af37] rounded-full text-sm tracking-widest hover:bg-[#d4af37] hover:text-black transition-all bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer text-black font-semibold z-10"
    >
      <span className="text-lg leading-none">{idioma === 'es' ? '🇬🇧' : '🇲🇽'}</span>
      <span className="font-bold">{idioma === 'es' ? 'ENG' : 'ESP'}</span>
    </button>
  );

  const URL_VIRTUAL_PLANET = "https://www.viosvirtualplanet.com/";

  // 💳 LÓGICA DE COBRO
  const manejarPagoStripe = async () => {
    try {
      console.log("Conectando con la bóveda para suscripción:", planSeleccionado.nombre);
      
      const respuesta = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: 'vios-subscription', 
          planName: planSeleccionado.nombre,
          amount: planSeleccionado.precio,
          email: datosCliente.email,
          nombreNegocio: datosCliente.nombreNegocio,
        }),
      });

      const datos = await respuesta.json();

      if (datos.urlPago) { 
        window.location.href = datos.urlPago; 
      } else {
        alert("Hubo un error al generar el cobro: " + datos.error);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con la pasarela de pagos.");
    }
  };

  const manejarAccesoGodMode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoAdmin(true);
    setErrorAdmin('');

    try {
      if (isCrearCuenta) {
        const { data, error } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
        });
        if (error) throw error;
        alert("Contraseña maestra guardada en la matriz con éxito. Por favor inicia sesión.");
        setIsCrearCuenta(false); 
        setAdminPassword('');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
        if (error) throw error;
        
        window.location.href = 'https://vioscode.io/god-mode'; 
      }
    } catch (error: any) {
      console.error('Error de acceso:', error.message);
      setErrorAdmin(`Error de Matriz: ${error.message}`);
    } finally {
      setCargandoAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-[#e91e63] selection:text-white antialiased flex flex-col relative">
      
      <nav className="fixed top-0 w-full bg-white/95 border-gray-200 backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo_vios.jpeg" alt="ViOs Code Logo" className="h-12 w-auto object-contain" />
        </div>
        <BotonIdioma />
      </nav>

      <main className="flex-grow">
        <SensorTrafico marca="VIOS_MAIN" />

        {/* 👤 SECCIÓN 1: LOGOS Y BIOGRAFÍA */}
        <section className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center mb-24 relative">
          
          <div className="w-full mb-20 flex flex-col items-center animate-[fadeIn_1s_ease-in-out]">
            <h4 className="text-gray-400 uppercase tracking-widest text-xs md:text-sm font-bold mb-8 text-center">
              {idioma === 'es' ? 'Marcas que impulsan el ecosistema' : 'Brands powering the ecosystem'}
            </h4>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-all duration-500">
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/logo_conquesito.jpeg" alt="Con Quesito" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/mulata_bw.jpeg" alt="Mulata" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/salsas_ketzzal.jpeg" alt="Salsas Ketzzal" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/logo_loyaltink.jpeg" alt="Magnolia" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/bernardita.jpeg" alt="Bernardita" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/templo_de_pieles.jpeg" alt="Templo de Pieles" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/logo_chaza.png" alt="Templo de Pieles" className="h-12 md:h-24 w-auto object-contain" />
               </a>
            </div>
          </div>

          {/* BIOS MÁS COMPACTAS */}
          <div className="flex flex-col w-full animate-[fadeIn_1s_ease-in-out] mb-16">
            <div className="flex flex-row items-center md:items-start gap-4 md:gap-12 w-full justify-center">
              <div className="w-1/4 md:w-40 shrink-0 relative">
                <img src="/tu_foto.jpeg" alt="Emmanuel Osorio" className="w-full h-auto rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.4)] border border-[#d4af37]" />
              </div>
              
              <div className="w-2/3 md:w-auto flex flex-col gap-1 md:gap-2 text-left text-black max-w-xl">
                <h2 className="font-montserrat text-lg md:text-4xl font-black tracking-tight leading-tight">
                  {idioma === 'es' ? 'Redefiniendo la' : 'Redefining the'} <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 block md:inline">
                    {idioma === 'es' ? 'Realidad Digital.' : 'Digital Reality.'}
                  </span>
                </h2>
                
                <div className="flex flex-col mt-1">
                  <h3 className="font-montserrat text-[9px] md:text-sm tracking-widest font-bold uppercase text-gray-800">
                    Emmanuel Alejandro Osorio Maza— CEO & Founder
                  </h3>
                  <h2 className="font-montserrat text-[8px] md:text-xs tracking-widest font-semibold uppercase text-gray-500 mt-1">
                    Quintana Roo
                  </h2>
                </div>
                
                <p className="text-gray-700 text-[10px] md:text-sm leading-relaxed max-w-xl mt-1 md:mt-2 font-normal text-left">
                  {idioma === 'es' 
                    ? 'En ViOs Code, no solo desarrollamos software; construimos ecosistemas inmersivos. Fusionamos la gestión empresarial de alto nivel con tecnologías de vanguardia como web3, realidad virtual y escaneo 3D.'
                    : 'At ViOs Code, we don\'t just develop software; we build immersive ecosystems. We merge high-level business management with cutting-edge technologies like web3, virtual reality, and 3D scanning.'}
                  <span className="hidden md:inline">
                    {' '}
                    {idioma === 'es'
                      ? 'Nuestro objetivo es llevar los negocios físicos de la Riviera Maya y del mundo hacia la siguiente dimensión del comercio digital.'
                      : 'Our goal is to take physical businesses from the Riviera Maya and the world into the next dimension of digital commerce.'}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:hidden w-full flex justify-center mt-4">
              <p className="text-gray-700 text-[10px] leading-relaxed font-normal text-left w-full px-1">
                {idioma === 'es'
                  ? 'Nuestro objetivo es llevar los negocios físicos de la Riviera Maya y del mundo hacia la siguiente dimensión del comercio digital.'
                  : 'Our goal is to take physical businesses from the Riviera Maya and the world into the next dimension of digital commerce.'}
              </p>
            </div>
          </div>

          <div className="w-full border-t border-gray-100 pt-12 animate-[fadeIn_1.2s_ease-in-out]">
            <div className="flex flex-row items-center md:items-start gap-4 md:gap-10 w-full justify-center">
              <div className="w-20 md:w-32 shrink-0 relative">
                <img src="/dir_grafic_rafa.jpeg" alt="Rafael Villanueva Cortes" className="w-full h-auto rounded-xl shadow-md border border-gray-200 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              
              <div className="flex-1 flex flex-col gap-1 md:gap-2 text-left text-black max-w-xl">
                <div className="flex flex-col">
                  <h3 className="font-montserrat text-xs md:text-xl font-bold text-gray-800">Rafael Villanueva Cortes</h3>
                  <h4 className="font-montserrat text-[8px] md:text-xs tracking-[0.2em] font-bold uppercase text-[#d4af37] mt-1">
                    {idioma === 'es' ? 'Director de Diseño Gráfico' : 'Graphic Design Director'}
                  </h4>
                </div>
                <p className="text-gray-600 text-[9px] md:text-sm leading-relaxed max-w-lg font-light italic mt-1">
                  {idioma === 'es'
                    ? 'Arquitecto visual del ecosistema. Lidera la creación de identidades de alto impacto, asegurando que la estética de cada proyecto en el multiverso sea impecable y vanguardista.'
                    : 'Visual architect of the ecosystem. Leads high-impact identity creation, ensuring that the aesthetics of every project in the multiverse are flawless and cutting-edge.'}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* 📊 SECCIÓN 2: PITCH COMERCIAL (GENERAL) */}
        <section className="px-4 md:px-8 w-full max-w-[95%] 2xl:max-w-[90%] mx-auto mb-32 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <h2 className="font-montserrat text-2xl md:text-4xl font-bold tracking-wide text-black">
              {idioma === 'es' ? 'Nuestro Modelo de Negocio' : 'Our Business Model'}
            </h2>
            <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-grow ml-8"></div>
          </div>
          <div className="w-full bg-white p-2 md:p-3 rounded-3xl border border-gray-200 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative group transition-all duration-300 hover:shadow-[0_0_60px_rgba(212,175,55,0.2)]">
            <iframe 
              // 🔄 Cambio dinámico de URL según el idioma seleccionado
              src={idioma === 'es' 
                ? "https://gamma.app/embed/35iitib1ydegd4v" // URL Español
                : "https://gamma.app/embed/b1zehx0r0bw2h6h" // URL Inglés
              } 
              className="w-full h-[550px] md:h-[800px] lg:h-[850px] rounded-2xl relative z-10 bg-white transition-all duration-500 border border-gray-100" 
              allowFullScreen 
              title={idioma === 'es' 
                ? "ViOs Code: Redefiniendo la Realidad Digital" 
                : "ViOs Code: Redefining Digital Reality"
              }
            ></iframe>
          </div>
        </section>

        {/* 🌌 SECCIÓN 3: LA ARQUITECTURA */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="font-montserrat text-3xl md:text-5xl font-black mb-4 text-black uppercase tracking-tighter">La Arquitectura del Multiverso</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {idioma === 'es' ? 'ViOs Code es el núcleo de un sistema escalable diseñado para conquistar el mercado digital paso a paso.' : 'ViOs Code is the core of a scalable system designed to conquer the digital market step by step.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="https://www.viosmetaverse.com/" target="_blank" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm block cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">ViOs Metaverso</h3>
              <p className="text-gray-600 text-sm">El portal principal. La interfaz de conexión interactiva que unifica nuestra tecnología.</p>
            </Link>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🌌</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Universe</h3>
              <p className="text-gray-600 text-sm">La red maestra. El contenedor global que aloja todos nuestros ecosistemas y tecnologías.</p>
            </div>

            <Link href={URL_VIRTUAL_PLANET} target="_blank" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-[#d4af37] hover:shadow-xl transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl group-hover:bg-[#d4af37]/20 transition-all"></div>
              <div className="text-5xl mb-6">🪐</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Planet</h3>
              <p className="text-gray-600 text-sm">Entornos globales divididos por industrias. Explora el ecosistema ahora.</p>
            </Link>

            <div className="bg-white border border-[#d4af37]/30 p-8 rounded-3xl hover:border-[#d4af37] transition-all relative overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl group-hover:bg-[#d4af37]/20 transition-all"></div>
              <div className="text-5xl mb-6">🏙️</div>
              <h3 className="font-montserrat text-2xl font-bold text-[#d4af37] mb-2">Virtual Metra</h3>
              <p className="text-gray-700 text-sm">Proyectos locales y específicos. El hogar de desarrollos inmersivos de alto nivel.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Social</h3>
              <p className="text-gray-600 text-sm">El núcleo de la comunidad. Plataformas interactivas para conectar en tiempo real.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🌍</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Nomad</h3>
              <p className="text-gray-600 text-sm">El puente físico-digital. Soluciones para ciudadanos del mundo que viven sin fronteras.</p>
            </div>
          </div>
        </section>

        {/* 💎 SECCIÓN 4: PLANES DE SUSCRIPCIÓN REDISEÑADOS */}
        <section id="planes" className="bg-zinc-950 py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 relative z-10">
              <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Membresías SaaS</h2>
              <p className="text-zinc-400 tracking-widest uppercase font-bold text-sm">Escoge tu nivel de inmersión en el ecosistema</p>
            </div>

            {/* GRID DE PLANES CON EFECTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {planes.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`relative p-[2px] rounded-[40px] group transition-all duration-500 hover:-translate-y-4 ${plan.glow} z-10 bg-zinc-900/50`}
                >
                  {/* Borde Animado */}
                  <div className={`absolute inset-0 rounded-[40px] ${plan.borderGrad} opacity-20 group-hover:opacity-100 transition-opacity duration-700 ${plan.isDiamond ? 'animate-pulse opacity-50' : ''}`}></div>
                  
                  {/* Tarjeta Interior */}
                  <div className="relative h-full bg-zinc-950 rounded-[38px] p-8 md:p-10 flex flex-col justify-between overflow-hidden z-20">
                    
                    {/* Resplandor interno sutil */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 ${plan.borderGrad} blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full`}></div>

                    <div>
                      <h3 className={`text-2xl font-black uppercase mb-3 text-white transition-colors duration-300 ${plan.titleHover}`}>
                        {plan.nombre}
                      </h3>
                      <p className="text-zinc-400 text-xs mb-8 leading-relaxed font-medium min-h-[40px]">
                        {plan.desc}
                      </p>
                      <div className="flex items-baseline gap-1 mb-10">
                        <span className="text-5xl font-black text-white tracking-tighter">${plan.precio}</span>
                        <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">/ Mes</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => { setPlanSeleccionado(plan); setPasoCompra(1); }} 
                      className="w-full relative py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl overflow-hidden group-hover:shadow-lg transition-all"
                    >
                      <span className="relative z-10">Seleccionar Plan</span>
                      {/* Efecto de barrido en el botón al hacer hover */}
                      <div className={`absolute inset-0 w-full h-full ${plan.borderGrad} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 🔐 BOTÓN GOD MODE */}
      <button 
        onClick={() => {setModalAdminAbierto(true); setIsCrearCuenta(false);}}
        className="fixed bottom-6 right-6 z-40 bg-zinc-900 text-zinc-500 p-3 rounded-full opacity-20 hover:opacity-100 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
        title="Terminal de Mando"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {/* 🧾 MODAL DE FLUJO DE COMPRA */}
      {pasoCompra > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b flex justify-between items-center bg-zinc-50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">Paso {pasoCompra} de 3</span>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
                  {pasoCompra === 1 ? 'Datos del Negocio' : pasoCompra === 2 ? 'Contrato de Adhesión' : 'Finalizar Pago'}
                </h2>
              </div>
              <button onClick={() => setPasoCompra(0)} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto font-inter">
             {pasoCompra === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input className="border p-4 rounded-xl outline-none focus:border-[#d4af37]" placeholder="Nombre Completo" onChange={(e) => setDatosCliente({...datosCliente, nombre: e.target.value})} />
                    <input className="border p-4 rounded-xl outline-none focus:border-[#d4af37]" placeholder="Nombre de tu Negocio" onChange={(e) => setDatosCliente({...datosCliente, nombreNegocio: e.target.value})} />
                  </div>
                  <input className="w-full border p-4 rounded-xl outline-none focus:border-[#d4af37]" placeholder="Correo Electrónico" type="email" onChange={(e) => setDatosCliente({...datosCliente, email: e.target.value})} />
                  
                  <div className="pt-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Duración del Contrato</label>
                    <select className="w-full border p-4 rounded-xl bg-zinc-50 font-bold outline-none" onChange={(e) => setDatosCliente({...datosCliente, duracionContrato: e.target.value})}>
                      <option value="3">3 Meses (Mínimo)</option>
                      <option value="6">6 Meses</option>
                      <option value="12">12 Meses (Pago anual con descuento)</option>
                    </select>
                  </div>

                  {/* 🔐 CAMPO DE CÓDIGO DE INVITACIÓN */}
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <label className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4" /> Código de Invitación VIP
                    </label>
                    <input 
                      className="w-full border-2 border-zinc-200 bg-zinc-50 p-4 rounded-xl outline-none focus:border-[#d4af37] font-mono text-center tracking-widest uppercase text-black font-bold placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 placeholder:font-normal placeholder:lowercase" 
                      placeholder="Ingresa la llave de acceso proporcionada" 
                      type="text" 
                      onChange={(e) => setCodigoAcceso(e.target.value.toUpperCase())} 
                    />
                    <p className="text-[9px] text-zinc-400 mt-2 text-center uppercase tracking-widest">
                      El acceso a ViOs Code está limitado a negocios pre-aprobados.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      // 🛑 LÓGICA DE BLOQUEO: Solo estos códigos dejarán pasar al cliente
                      if (codigoAcceso === 'VIOS-2026' || codigoAcceso === 'TULUM-VIP') {
                        setPasoCompra(2);
                      } else {
                        alert('❌ Acceso Denegado: Código de invitación inválido o expirado. Por favor, contacta a un asesor de ViOs Code para aplicar a nuestro ecosistema.');
                      }
                    }} 
                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm mt-6 hover:bg-zinc-800 transition-colors shadow-lg"
                  >
                    Validar Código y Continuar
                  </button>
                </div>
              )}

              {pasoCompra === 2 && (
                <div>
                  <div className="bg-zinc-50 p-6 rounded-2xl border mb-6 text-[11px] leading-relaxed text-zinc-600 h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300">
                    <h4 className="font-black text-black mb-4 uppercase text-xs">CONTRATO DE PRESTACIÓN DE SERVICIOS DIGITALES Y TECNOLÓGICOS (SaaS)</h4>
                    <p className="mb-4">El presente contrato vincula legalmente a <strong>ViOs Code</strong> (en adelante "El Proveedor") y a <strong>{datosCliente.nombreNegocio || 'El Cliente'}</strong> (en adelante "El Cliente") por un periodo inicial forzoso de <strong>{datosCliente.duracionContrato} meses</strong>.</p>

                    <p className="font-black text-black mt-6 mb-1">1. OBJETO DEL CONTRATO Y SERVICIOS</p>
                    <p className="mb-4">El Cliente adquiere una licencia de uso de software como servicio (SaaS) correspondiente a la membresía <strong>{planSeleccionado?.nombre}</strong>. El Proveedor se compromete a otorgar la infraestructura tecnológica, pasarela de pagos integrada y herramientas digitales especificadas en dicho plan. El Proveedor actúa estrictamente como intermediario y desarrollador tecnológico.</p>

                    <p className="font-black text-black mt-6 mb-1">2. CONDICIONES DE PAGO Y FACTURACIÓN</p>
                    <p className="mb-4">El Cliente acepta y autoriza el cargo recurrente automático a través de nuestro procesador de pagos verificado (Stripe) por la cantidad mensual estipulada en su plan. En caso de fallos técnicos o fondos insuficientes en el método de pago, el servicio podrá suspenderse de manera automática. La factura fiscal correspondiente será generada y enviada automáticamente por la plataforma de Stripe a los datos proporcionados durante este registro.</p>

                    <p className="font-black text-black mt-6 mb-1">3. VIGENCIA Y FLEXIBILIDAD DE CANCELACIÓN</p>
                    <p className="mb-4">El presente servicio tiene un periodo de permanencia inicial de <strong>{datosCliente.duracionContrato} meses</strong>. Entendemos que las necesidades de tu negocio pueden cambiar, por lo que <strong>puedes solicitar la cancelación de la renovación automática en cualquier momento</strong> antes de finalizar tu ciclo. Si decides cancelar de manera anticipada (por ejemplo, en el mes dos), tu servicio y pagos continuarán de manera regular hasta cumplir los {datosCliente.duracionContrato} meses contratados; al término de dicho plazo, tu plan quedará cancelado automáticamente y sin cargos adicionales.</p>
                    <p className="mb-4">Para tu total transparencia y tranquilidad, El Proveedor te enviará un recordatorio <strong>5 días antes</strong> del término de tu plan, informándote que está próximo a vencer. En caso de que El Cliente no notifique su deseo de cancelación o cambio de membresía (mediante un mensaje directo o correo a <strong>osorioalejandro21777@gmail.com</strong>), el plan se renovará automáticamente bajo las mismas condiciones y duración del plan corriente, garantizando así la operatividad ininterrumpida de tus servicios digitales.</p>

                    <p className="font-black text-black mt-6 mb-1">4. LÍMITE Y DESLINDE DE RESPONSABILIDAD (USO E IMPACTO COMERCIAL)</p>
                    <p className="mb-4">ViOs Code provee exclusivamente infraestructura, código y herramientas digitales. <strong>ViOs Code se deslinda expresa y totalmente de cualquier responsabilidad legal, médica, penal, civil o mercantil</strong> que pudiera derivar del giro comercial, las prácticas operativas, los productos vendidos o los servicios ofrecidos por El Cliente a sus consumidores finales. En caso de suscitarse problemas operativos tales como (de manera enunciativa mas no limitativa): reacciones alérgicas por procedimientos estéticos o tatuajes, intoxicaciones, accidentes físicos dentro de las instalaciones del cliente, o disputas legales por la calidad o incumplimiento del servicio brindado por El Cliente, la responsabilidad recaerá única y exclusivamente sobre El Cliente. ViOs Code no garantiza un margen específico de rentabilidad, siendo el éxito o fracaso comercial responsabilidad íntegra de la gestión administrativa de El Cliente.</p>

                    <p className="font-black text-black mt-6 mb-1">5. PROPIEDAD INTELECTUAL Y MARCAS REGISTRADAS</p>
                    <p className="mb-4">El Cliente declara y garantiza que es el titular legítimo o posee las licencias legales correspondientes de todas las marcas, logotipos, imágenes comerciales y textos que decida exhibir dentro del ecosistema digital provisto por ViOs Code. El Proveedor se deslinda de cualquier disputa legal, uso indebido de derechos de autor, plagio o infracción de propiedad intelectual de terceros cometida o cargada por El Cliente en sus respectivas plataformas y menús digitales.</p>

                    <p className="font-black text-black mt-6 mb-1">6. DISPONIBILIDAD DE LOS SERVIDORES</p>
                    <p className="mb-4">El Proveedor realizará los mejores esfuerzos de ingeniería para mantener la plataforma operativa las 24 horas del día. Sin embargo, no asume responsabilidad directa por interrupciones del servicio derivadas de caídas a nivel global en servidores de terceros que sostienen el ecosistema (tales como AWS, Vercel, Supabase o Stripe), mantenimientos programados informados previamente, o causas de fuerza mayor (desastres naturales, cortes masivos de internet).</p>
                  </div>
                  <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 accent-black" id="checkContrato" />
                    <span className="text-sm font-bold">He leído todo el contrato y acepto los términos, el deslinde de responsabilidad y el periodo de permanencia.</span>
                  </label>
                  <button onClick={() => setPasoCompra(3)} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm mt-6 hover:bg-zinc-800 transition-colors">
                    Aceptar y Proceder al Pago
                  </button>
                </div>
              )}

              {pasoCompra === 3 && (
                <div className="text-center">
                  <div className="mb-8 p-8 bg-zinc-50 rounded-[30px] border">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Resumen de Suscripción</p>
                    <h3 className="text-3xl font-black text-black uppercase mb-1">{planSeleccionado.nombre}</h3>
                    <p className="text-4xl font-black text-[#d4af37]">${planSeleccionado.precio} <span className="text-xs text-zinc-400">MXN/mes</span></p>
                    <div className="mt-4 text-xs font-bold text-zinc-500 uppercase">Compromiso: {datosCliente.duracionContrato} meses recurrentes</div>
                  </div>
                  <button onClick={manejarPagoStripe} className="w-full bg-[#635bff] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:bg-[#524be0] transition-colors">
                    <Lock className="w-4 h-4" /> Pagar con Stripe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔐 MODAL GOD MODE LOGIN / CREAR PASSWORD */}
      {modalAdminAbierto && (
        <div className="fixed inset-0 z-[200] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[30px] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <button 
              onClick={() => {setModalAdminAbierto(false); setErrorAdmin('');}} 
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-inner">
                <Key className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
            
            <h2 className="text-center text-white font-black uppercase tracking-widest text-xl mb-1">
              {isCrearCuenta ? 'Crear Llave Maestra' : 'Terminal de Mando'}
            </h2>
            <p className="text-center text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
              Acceso Restringido • azteca777
            </p>

            <form onSubmit={manejarAccesoGodMode} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  value={adminEmail}
                  readOnly
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 text-sm font-bold p-4 rounded-xl outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder={isCrearCuenta ? "Ingresa tu nueva contraseña" : "Contraseña de la Matriz"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm p-4 rounded-xl outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-700"
                  required
                />
              </div>
              
              {errorAdmin && <p className="text-red-500 text-xs text-center font-bold">{errorAdmin}</p>}

              <button 
                type="submit" 
                disabled={cargandoAdmin}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl mt-4 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                {cargandoAdmin ? 'Procesando...' : (isCrearCuenta ? 'Guardar en Base de Datos' : 'Iniciar Protocolo')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => {setIsCrearCuenta(!isCrearCuenta); setErrorAdmin(''); setAdminPassword('');}}
                className="text-[10px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
              >
                {isCrearCuenta ? 'Volver al Login' : '¿Primera vez? Crear clave de acceso'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER LEGAL */}
      <footer className="w-full bg-[#f9f9f9] border-t border-gray-200 py-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-inter">© {new Date().getFullYear()} ViOs Code. Todos los derechos reservados.</p>
          <div className="flex gap-6 italic text-xs text-gray-400">Poder digital por Emmanuel Osorio</div>
        </div>
      </footer>

    </div>
  );
}