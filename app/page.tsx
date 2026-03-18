'use client';

import { useState } from 'react';

export default function ViosCodeMatriz() {
  const [idioma, setIdioma] = useState('es');
  
  // 🔥 El interruptor maestro de la intro
  const [introTerminada, setIntroTerminada] = useState(false);

  const BotonIdioma = () => (
    <button 
      onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')} 
      className="flex items-center gap-2 px-6 py-2 border border-[#d4af37] rounded-full text-sm tracking-widest hover:bg-[#d4af37] hover:text-black transition-all bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer text-black font-semibold z-10"
    >
      <span className="text-lg leading-none">{idioma === 'es' ? '🇬🇧' : '🇲🇽'}</span>
      <span className="font-bold">{idioma === 'es' ? 'ENG' : 'ESP'}</span>
    </button>
  );

  return (
    // 🔥 CAMBIO MAESTRO: El fondo cambia automáticamente según el estado de la intro
    <div className={`min-h-screen ${!introTerminada ? 'bg-black' : 'bg-white'} font-inter selection:bg-[#e91e63] selection:text-white pb-20 antialiased transition-colors duration-1000`}>
      
      {/* 🌌 BARRA DE NAVEGACIÓN SUPERIOR (También cambia de color) */}
      <nav className={`fixed top-0 w-full ${!introTerminada ? 'bg-black/90 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center shadow-sm transition-all duration-1000`}>
        <div className="flex items-center gap-3 relative z-10">
          
          {/* 👇 LOGOTIPO OFICIAL INTEGRADO 👇 */}
          {/* Usamos invert() en modo cine para que el texto negro se vuelva blanco y resalte sobre el fondo negro */}
          <img 
            src="/logo_vios.jpeg" 
            alt="ViOs Code Logo" 
            className={`h-12 w-auto object-contain transition-all duration-1000 ${!introTerminada ? 'invert brightness-0' : ''}`}
          />
          
        </div>
        <BotonIdioma />
      </nav>

      {/* 👤 SECCIÓN 1: INTRO / BIOGRAFÍA (Ocupa mucho espacio para el efecto cine) */}
      <section className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh] mb-24 relative">
        
        {!introTerminada ? (
          
          /* 🎬 EL REPRODUCTOR INTRO ("Cinematic Mode" activado) */
          <div className="w-full max-w-5xl relative rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.3)] border border-gray-800 bg-black animate-[fadeIn_1s_ease-in-out]">
            <video 
              src="/video_intro.mp4" 
              autoPlay 
              muted // <-- Mute para Autoplay automático
              playsInline
              onEnded={() => setIntroTerminada(true)} 
              // pointer-events-none evita que el usuario le dé clic derecho o lo pause por error
              className="w-full h-auto pointer-events-none" 
            />
            {/* Botón sutil adaptado para fondo oscuro */}
            <button 
              onClick={() => setIntroTerminada(true)}
              className="absolute bottom-6 right-6 text-xs text-white/70 hover:text-white font-semibold px-4 py-2 border border-white/20 hover:border-white rounded-full transition-all bg-black/50 backdrop-blur-sm z-10"
            >
              Saltar Intro ➔
            </button>
          </div>

        ) : (

          /* 📸 LA FOTO Y BIOGRAFÍA (Ahora alineada a la izquierda en celulares) */
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 w-full animate-[fadeIn_1s_ease-in-out]">
            
            {/* Contenedor de la foto centrado en móviles, pero manteniendo el texto a la izquierda */}
            <div className="w-24 md:w-50 shrink-0 relative mx-auto md:mx-0">
              <img 
                src="/tu_foto.jpeg" 
                alt="Emmanuel Osorio" 
                className="w-full h-auto rounded-2xl shadow-[0_0_90px_rgba(212,175,55,0.8)] border-2 border-[#d4af37]" 
              />
            </div>
            
            {/* CAMBIO AQUÍ: Se reemplazó "text-center" por "text-left" en este div contenedor */}
            <div className="flex flex-col gap-4 text-left md:ml-25 text-black w-full">
              <h2 className="font-montserrat text-4xl md:text-6xl font-black tracking-tight">
                {idioma === 'es' ? 'Redefiniendo la' : 'Redefining the'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                  {idioma === 'es' ? 'Realidad Digital.' : 'Digital Reality.'}
                </span>
              </h2>
              <h3 className="font-montserrat text-xl tracking-widest font-bold uppercase">Emmanuel Osorio — CEO & Founder</h3>
              {/* Párrafo justificado a la izquierda */}
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mt-4 font-normal text-left">
                {idioma === 'es' 
                  ? 'En ViOs Code, no solo desarrollamos software; construimos ecosistemas inmersivos. Fusionamos la gestión empresarial de alto nivel con tecnologías de vanguardia como web3, realidad virtual y escaneo 3D. Nuestro objetivo es llevar los negocios físicos de la Riviera Maya y del mundo hacia la siguiente dimensión del comercio digital.'
                  : 'At ViOs Code, we don\'t just develop software; we build immersive ecosystems. We merge high-level business management with cutting-edge technologies like web3, virtual reality, and 3D scanning. Our goal is to take physical businesses from the Riviera Maya and the world into the next dimension of digital commerce.'}
              </p>
            </div>
            
          </div>
        )}
      </section>

      {/* 📊 SECCIÓN 2: PITCH COMERCIAL (GAMMA) - GIGANTE (Mismo diseño claro premium) */}
      <section className="px-4 md:px-8 w-full max-w-[95%] 2xl:max-w-[90%] mx-auto mb-32 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8">
          {/* Título también dinámico para contrastar en el fondo cambiante */}
          <h2 className={`font-montserrat text-2xl md:text-4xl font-bold tracking-wide ${!introTerminada ? 'text-white' : 'text-black'} transition-colors duration-1000`}>
            {idioma === 'es' ? 'Nuestra Propuesta' : 'Our Pitch'}
          </h2>
          <div className={`h-px ${!introTerminada ? 'bg-gradient-to-r from-gray-800 to-transparent' : 'bg-gradient-to-r from-gray-300 to-transparent'} flex-grow ml-8 transition-colors duration-1000`}></div>
        </div>
        
        <div className="w-full bg-white p-2 md:p-3 rounded-3xl border border-gray-200 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative group transition-all duration-300 hover:shadow-[0_0_60px_rgba(212,175,55,0.2)]">
          <iframe 
            src={idioma === 'es' ? "https://gamma.app/embed/nnm8h0tsflagjhn" : "https://gamma.app/embed/rt9rhkzyfj7yyqk"} 
            className="w-full h-[550px] md:h-[800px] lg:h-[850px] rounded-2xl relative z-10 bg-white transition-all duration-500 border border-gray-100" 
            allowFullScreen 
            title={idioma === 'es' ? "Tu Negocio en la Nueva Dimensión" : "Your Business in the New Dimension"}
          ></iframe>
        </div>
      </section>

      {/* 🌌 SECCIÓN 3: LA ARQUITECTURA (Mismo diseño claro premium) */}
      <section className="px-6 max-w-6xl mx-auto">
        {/* Título dinámico para contraste */}
        <div className="text-center mb-16">
          <h2 className={`font-montserrat text-3xl md:text-5xl font-black mb-4 ${!introTerminada ? 'text-white' : 'text-black'} transition-colors duration-1000`}>
            {idioma === 'es' ? 'La Arquitectura del Multiverso' : 'The Multiverse Architecture'}
          </h2>
          <p className={`${!introTerminada ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto transition-colors duration-1000`}>
            {idioma === 'es' ? 'ViOs Code es el núcleo de un sistema escalable diseñado para conquistar el mercado digital paso a paso.' : 'ViOs Code is the core of a scalable system designed to conquer the digital market step by step.'}
          </p>
        </div>

        {/* Tarjetas de arquitectura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🌌</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Universe</h3>
            <p className="text-gray-600 text-sm">
              {idioma === 'es' ? 'La red maestra. El contenedor global que aloja todos nuestros ecosistemas y tecnologías.' : 'The master network. The global container that hosts all our ecosystems and technologies.'}
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🪐</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Planet</h3>
            <p className="text-gray-600 text-sm">
              {idioma === 'es' ? 'Entornos globales divididos por industrias (Hospitalidad, Bienes Raíces, Retail).' : 'Global environments divided by industries (Hospitality, Real Estate, Retail).'}
            </p>
          </div>

          <div className="bg-white border border-[#d4af37]/30 p-8 rounded-3xl hover:border-[#d4af37] transition-all relative overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl group-hover:bg-[#d4af37]/20 transition-all"></div>
            <div className="text-5xl mb-6">🏙️</div>
            <h3 className="font-montserrat text-2xl font-bold text-[#d4af37] mb-2">Virtual Metra</h3>
            <p className="text-gray-700 text-sm">
              {idioma === 'es' ? 'Proyectos locales y específicos. El hogar de desarrollos inmersivos como Tianguis Tulum.' : 'Local and specific projects. The home of immersive developments like Tianguis Tulum.'}
            </p>
            {/* 👇 BOTÓN CONECTADO A TIANGUIS TULUM 👇 */}
            {/* Reemplaza el # con el link real de tu página de Tianguis Tulum cuando la tengas */}
            <a 
              href="https://www.tianguistulum.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-block px-6 py-2 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-sm font-bold border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-white transition-all"
            >
              {idioma === 'es' ? 'Explorar Tianguis Tulum ➔' : 'Explore Tianguis Tulum ➔'}
            </a>
          </div>
        </div>
      </section>

      {/* Pequeño CSS para la animación suave al cambiar de video a texto */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}