import React from 'react';

export default function FrancoVigilePage() {
  return (
    <div className="bg-black text-white antialiased min-h-screen font-sans">
      
      {/* ENCABEZADO Y NAVEGACIÓN */}
      <header className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent pb-24">
        <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          {/* Logo de Franco */}
          <div className="cursor-pointer">
            <img 
              src="/vigile/logo_franco.png" 
              alt="Logo Franco Vigile" 
              className="h-20 md:h-28 w-auto object-contain"
            />
          </div>
          
          {/* Enlaces de menú */}
          <ul className="hidden md:flex space-x-8 text-xs font-light uppercase tracking-[0.15em] text-gray-200">
            <li className="hover:text-white cursor-pointer transition-colors">About</li>
            <li className="hover:text-white cursor-pointer transition-colors">Company</li>
            <li className="hover:text-white cursor-pointer transition-colors">Insights</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
          
          {/* Icono de menú para móvil */}
          <div className="md:hidden text-[#D4A76A] cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </nav>
      </header>

      <main>
        {/* SECCIÓN HERO */}
        <section className="relative min-h-screen bg-black flex flex-col justify-end md:justify-center overflow-hidden">
          
          {/* IMAGEN PARA CELULARES */}
          <div className="absolute top-0 left-0 w-full h-[65vh] md:hidden z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
              style={{ backgroundImage: "url('/vigile/franco-hero3.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          {/* IMAGEN PARA PC */}
          <div className="hidden md:block absolute top-0 right-0 w-[50%] h-full z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[center_left] bg-no-repeat"
              style={{ backgroundImage: "url('/vigile/franco-hero2.jpeg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent w-[15%]" />
          </div>

          {/* CONTENEDOR DEL TEXTO */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-[35vh] md:pt-32 md:pb-0">
            <div className="w-full md:w-[65%] space-y-8 md:pr-4">
              
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.15] tracking-wide text-white drop-shadow-lg md:drop-shadow-none mb-2">
                  Building breakthrough <br /> therapeutics.
                </h1>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.15] tracking-wide text-[#D4A76A] drop-shadow-lg md:drop-shadow-none">
                  Advancing science. <br />
                  Transforming lives.
                </h2>
              </div>
              
              <div className="pt-2">
                <div className="w-16 h-[1px] bg-gray-600 mb-6" />
                <p className="text-sm md:text-base font-bold uppercase tracking-[0.15em] text-[#D4A76A]">
                  Franco Vigile
                </p>
                <p className="text-sm md:text-base font-light text-gray-200 mt-2 leading-relaxed">
                  Co-Founder & CEO, N-Zyme Biomedical <br />
                  Founder of HaluGen Life Sciences
                </p>
              </div>

              <div className="pt-2">
                <button className="border border-[#D4A76A] text-[#D4A76A] px-8 py-3 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4A76A] hover:text-black transition-colors flex items-center justify-center gap-4 w-fit">
                  Learn More 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A76A] mb-4">
                  As seen in
                </p>
                <div className="w-full md:w-80 h-[1px] bg-[#D4A76A]/40 mb-6" />
                <div className="flex items-center gap-8 md:gap-10 opacity-90">
                  {/* Forbes - Aumentamos el tamaño a text-3xl md:text-4xl */}
                  <span className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tighter">
                    Forbes
                  </span>
                  <span className="font-sans text-[9px] md:text-[11px] leading-tight font-bold text-white uppercase tracking-widest text-center">
                    Business<br/>Insider
                  </span>
                  <span className="font-serif text-[9px] md:text-[11px] leading-[1.1] font-bold text-white uppercase text-center flex items-start gap-1">
                    <span>The<br/>Globe<br/>And<br/>Mail</span>
                    <span className="text-[6px] mt-1">★</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            NUEVA SECCIÓN DIVIDIDA: VIDEO (IZQ) + CTA (DER)
            ========================================= */}
        <section className="bg-white py-24 px-6 relative z-20">
          {/* Cambiamos max-w-7xl por max-w-5xl para hacer todo el bloque más angosto y estilizado */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* LADO IZQUIERDO: VIDEO */}
            <div className="rounded-xl overflow-hidden shadow-2xl relative bg-black min-h-[300px] lg:min-h-full">
              <video
                src="/vigile/video_n-zyme1.mp4" 
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* LADO DERECHO: BANNER NEGRO (CTA) */}
            <div className="bg-[#111] text-white rounded-xl p-10 md:p-12 shadow-2xl flex flex-col justify-between h-full">
              
              <div className="space-y-4 mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A76A]">The Future of Reflux Treatment</p>
                <div className="w-12 h-[1px] bg-[#D4A76A]" />
                <h2 className="font-serif text-3xl md:text-4xl leading-tight">Let's Build the Future of Reflux Treatment.</h2>
              </div>
              
              <div className="space-y-6 mb-10">
                <p className="text-sm font-light text-gray-300 leading-relaxed">I connect with investors, operators, and innovators who share the vision of creating meaningful impact through science.</p>
                <button className="bg-[#D4A76A] text-black px-6 py-4 rounded-[4px] font-semibold text-xs tracking-[0.15em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 w-fit">
                  Start a conversation 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              
              {/* Separador sutil para los datos de la empresa */}
              <div className="border-t border-gray-800 pt-8 flex gap-5">
                <div className="text-[#D4A76A] shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-2">N-Zyme Biomedical</h3>
                  <p className="text-xs font-light text-gray-400 mb-4">Building the first pepsin inhibitor for reflux.</p>
                  <a href="#" className="text-xs font-semibold tracking-[0.1em] text-gray-300 hover:text-[#D4A76A] transition-colors flex items-center gap-2 uppercase">
                    Explore N-Zyme Biomedical
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}