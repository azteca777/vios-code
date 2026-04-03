'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ViosCodeMatriz() {
  const [idioma, setIdioma] = useState('es');

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

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-[#e91e63] selection:text-white antialiased flex flex-col">
      
      {/* 🌌 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="fixed top-0 w-full bg-white/95 border-gray-200 backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 relative z-10">
          <img 
            src="/logo_vios.jpeg" 
            alt="ViOs Code Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
        <BotonIdioma />
      </nav>

      {/* CONTENIDO PRINCIPAL QUE CRECE PARA EMPUJAR EL FOOTER */}
      <main className="flex-grow">
        {/* 👤 SECCIÓN 1: LOGOS Y BIOGRAFÍA */}
        <section className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center mb-24 relative">
          
          {/* 🏆 SECCIÓN: MARCAS / LOGOTIPOS */}
          <div className="w-full mb-16 flex flex-col items-center animate-[fadeIn_1s_ease-in-out]">
            <h4 className="text-gray-400 uppercase tracking-widest text-xs md:text-sm font-bold mb-6 text-center">
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
                  <img src="/magnolia.jpeg" alt="Magnolia" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/bernardita.jpeg" alt="Bernardita" className="h-12 md:h-24 w-auto object-contain" />
               </a>
               <a href={URL_VIRTUAL_PLANET} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                  <img src="/templo_de_pieles.jpeg" alt="Templo de Pieles" className="h-12 md:h-24 w-auto object-contain" />
               </a>
            </div>
          </div>

          {/* 📸 BIOGRAFÍA EMMANUEL */}
          <div className="flex flex-col w-full animate-[fadeIn_1s_ease-in-out] mb-20">
            <div className="flex flex-row items-center md:items-start gap-4 md:gap-20 lg:gap-32 w-full">
              <div className="w-1/3 md:w-64 shrink-0 relative">
                <img 
                  src="/tu_foto.jpeg" 
                  alt="Emmanuel Osorio" 
                  className="w-full h-auto rounded-2xl shadow-[0_0_90px_rgba(212,175,55,0.8)] border-2 border-[#d4af37]" 
                />
              </div>
              
              <div className="w-2/3 md:w-auto md:flex-1 flex flex-col gap-2 md:gap-4 text-left text-black">
                <h2 className="font-montserrat text-xl md:text-6xl font-black tracking-tight leading-tight">
                  {idioma === 'es' ? 'Redefiniendo la' : 'Redefining the'} <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 block md:inline">
                    {idioma === 'es' ? 'Realidad Digital.' : 'Digital Reality.'}
                  </span>
                </h2>
                
                <div className="flex flex-col mt-1 md:mt-0">
                  <h3 className="font-montserrat text-[10px] md:text-xl tracking-widest font-bold uppercase text-gray-800">
                    Emmanuel Alejandro Osorio Maza— CEO & Founder
                  </h3>
                  <h2 className="font-montserrat text-[9px] md:text-sm tracking-widest font-semibold uppercase text-gray-500 mt-1">
                    Quintana Roo
                  </h2>
                </div>
                
                <p className="text-gray-700 text-xs md:text-lg leading-relaxed md:leading-relaxed max-w-2xl mt-1 md:mt-4 font-normal text-left">
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
            <div className="md:hidden w-full flex justify-center mt-6">
              <p className="text-gray-700 text-xs leading-relaxed font-normal text-left w-full px-1">
                {idioma === 'es'
                  ? 'Nuestro objetivo es llevar los negocios físicos de la Riviera Maya y del mundo hacia la siguiente dimensión del comercio digital.'
                  : 'Our goal is to take physical businesses from the Riviera Maya and the world into the next dimension of digital commerce.'}
              </p>
            </div>
          </div>

          {/* 🎨 SECCIÓN: DIRECTOR DE DISEÑO (RAFAEL) */}
          <div className="w-full border-t border-gray-100 pt-16 animate-[fadeIn_1.2s_ease-in-out]">
            <div className="flex flex-row items-center md:items-start gap-6 md:gap-16 w-full">
              <div className="w-24 md:w-44 shrink-0 relative">
                <img 
                  src="/dir_grafic_rafa.jpeg" 
                  alt="Rafael Villanueva Cortes" 
                  className="w-full h-auto rounded-xl shadow-lg border border-gray-200 grayscale hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              
              <div className="flex-1 flex flex-col gap-1 md:gap-3 text-left text-black">
                <div className="flex flex-col">
                  <h3 className="font-montserrat text-sm md:text-3xl font-bold text-gray-800">
                    Rafael Villanueva Cortes
                  </h3>
                  <h4 className="font-montserrat text-[9px] md:text-sm tracking-[0.2em] font-bold uppercase text-[#d4af37] mt-1">
                    {idioma === 'es' ? 'Director de Diseño Gráfico' : 'Graphic Design Director'}
                  </h4>
                </div>
                
                <p className="text-gray-600 text-[10px] md:text-base leading-relaxed max-w-xl font-light italic">
                  {idioma === 'es'
                    ? 'Arquitecto visual del ecosistema. Lidera la creación de identidades de alto impacto, asegurando que la estética de cada proyecto en el multiverso sea impecable y vanguardista.'
                    : 'Visual architect of the ecosystem. Leads high-impact identity creation, ensuring that the aesthetics of every project in the multiverse are flawless and cutting-edge.'}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* 📊 SECCIÓN 2: PITCH COMERCIAL (NUEVO MODELO GAMMA) */}
        <section className="px-4 md:px-8 w-full max-w-[95%] 2xl:max-w-[90%] mx-auto mb-32 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <h2 className="font-montserrat text-2xl md:text-4xl font-bold tracking-wide text-black">
              {idioma === 'es' ? 'Nuestro Modelo de Negocio' : 'Our Business Model'}
            </h2>
            <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-grow ml-8"></div>
          </div>
          
          <div className="w-full bg-white p-2 md:p-3 rounded-3xl border border-gray-200 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative group transition-all duration-300 hover:shadow-[0_0_60px_rgba(212,175,55,0.2)]">
            <iframe 
              src={idioma === 'es' ? "https://gamma.app/embed/qckwr0gsgl9a8gv" : "https://gamma.app/embed/1smkc5wzbe09g48"} 
              className="w-full h-[550px] md:h-[800px] lg:h-[850px] rounded-2xl relative z-10 bg-white transition-all duration-500 border border-gray-100" 
              allowFullScreen 
              title={idioma === 'es' ? "El Futuro del Comercio: Tu Negocio en la Siguiente Dimensión" : "The Future of Commerce: Your Business in the Next Dimension"}
            ></iframe>
          </div>
        </section>

        {/* 🌌 SECCIÓN 3: LA ARQUITECTURA */}
        <section className="px-6 max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="font-montserrat text-3xl md:text-5xl font-black mb-4 text-black">
              {idioma === 'es' ? 'La Arquitectura del Multiverso' : 'The Multiverse Architecture'}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {idioma === 'es' ? 'ViOs Code es el núcleo de un sistema escalable diseñado para conquistar el mercado digital paso a paso.' : 'ViOs Code is the core of a scalable system designed to conquer the digital market step by step.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="https://www.viosmetaverse.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm block cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">ViOs Metaverso</h3>
              <p className="text-gray-600 text-sm">
                {idioma === 'es' ? 'El portal principal. La interfaz de conexión interactiva que unifica nuestra tecnología, negocios y usuarios.' : 'The main portal. The interactive connection interface that unifies our technology, businesses, and users.'}
              </p>
            </Link>

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
              <a 
                href="https://www.tianguistulum.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 inline-block px-6 py-2 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-sm font-bold border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-white transition-all"
              >
                {idioma === 'es' ? 'Explorar Tianguis Tulum ➔' : 'Explore Tianguis Tulum ➔'}
              </a>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Social</h3>
              <p className="text-gray-600 text-sm">
                {idioma === 'es' ? 'El núcleo de la comunidad. Plataformas interactivas diseñadas para conectar usuarios, avatares y marcas en tiempo real.' : 'The community core. Interactive platforms designed to connect users, avatars, and brands in real-time.'}
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
              <div className="text-5xl mb-6">🌍</div>
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Nomad</h3>
              <p className="text-gray-600 text-sm">
                {idioma === 'es' ? 'El puente físico-digital. Soluciones para ciudadanos del mundo que trabajan, viajan y viven sin fronteras.' : 'The physical-digital bridge. Solutions for global citizens who work, travel, and live without borders.'}
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* 🛡️ FOOTER LEGAL */}
      <footer className="w-full bg-[#f9f9f9] border-t border-gray-200 py-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-500 text-sm font-inter">
              © {new Date().getFullYear()} ViOs Code. {idioma === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
            <p className="text-gray-400 text-xs font-inter mt-1">
              {idioma === 'es' 
                ? 'Representante legal: Emmanuel Alejandro Osorio Maza' 
                : 'Legal Representative: Emmanuel Alejandro Osorio Maza'}
            </p>
          </div>
          <div className="flex gap-6">
            <Link 
              href="/politica-de-privacidad" 
              className="text-sm font-medium text-gray-500 hover:text-[#d4af37] transition-colors"
            >
              {idioma === 'es' ? 'Aviso de Privacidad' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}