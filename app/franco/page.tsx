import React from 'react';

export default function FrancoVigilePage() {
  return (
    <div className="bg-black text-white antialiased min-h-screen font-sans">
      
      {/* ENCABEZADO Y NAVEGACIÓN */}
      <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif text-[#cba358] tracking-widest cursor-pointer">FV</div>
          <ul className="hidden md:flex space-x-8 text-xs font-light uppercase tracking-[0.15em] text-gray-300">
            <li className="hover:text-white cursor-pointer transition-colors">About</li>
            <li className="hover:text-white cursor-pointer transition-colors">Company</li>
            <li className="hover:text-white cursor-pointer transition-colors">Insights</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
          {/* Icono de menú para móvil */}
          <div className="md:hidden text-[#cba358] cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </nav>
      </header>

      <main>
        {/* SECCIÓN HERO */}
        <section className="relative min-h-screen bg-black flex flex-col justify-end md:justify-center overflow-hidden">
          
          {/* =========================================
              IMAGEN PARA CELULARES (Evita el recorte)
              ========================================= */}
          {/* Se coloca en la parte superior con un alto máximo de 65vh (65% de la pantalla). */}
          <div className="absolute top-0 left-0 w-full h-[65vh] md:hidden z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
              style={{ backgroundImage: "url('/vigile/franco-hero2.jpeg')" }}
            />
            {/* Gradiente vertical: Negro sólido abajo fundiéndose hacia arriba */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          {/* =========================================
              IMAGEN PARA PC (Efecto de 3 Columnas)
              ========================================= */}
          {/* La imagen SOLO ocupa el 60% derecho de la pantalla, evitando el súper-zoom */}
          <div className="hidden md:block absolute top-0 right-0 w-[60%] h-full z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[center_right] bg-no-repeat"
              style={{ backgroundImage: "url('/vigile/franco-hero2.jpeg')" }}
            />
            {/* Columna 2 (Transición): De negro sólido a la izquierda a transparente a la derecha */}
            <div className="absolute inset-0 bg-gradient-to-r from-black from-0% via-black/60 via-[30%] to-transparent to-[70%]" />
          </div>

          {/* =========================================
              CONTENEDOR DEL TEXTO (Columna 1)
              ========================================= */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-[45vh] md:pt-0 md:pb-0">
            {/* En PC, limitamos el ancho del texto al 55% para no invadir la Columna 3 (la foto de Franco) */}
            <div className="w-full md:w-[60%] lg:w-[55%] space-y-6 md:pr-10">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] drop-shadow-lg md:drop-shadow-none">
                Building the First Pepsin Inhibitor for Reflux
              </h1>
              <p className="text-lg md:text-2xl font-light text-[#cba358]">
                Redefining the Standard of Care for Millions Worldwide
              </p>
              
              <div className="border-t border-gray-700 pt-6 mt-8">
                <p className="text-xl md:text-2xl font-light text-white">Franco Vigile</p>
                <p className="text-xs md:text-sm font-light text-gray-400 mt-1">
                  Entrepreneur | CEO | N-Zyme Biomedical
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-[#cba358] text-black px-6 py-4 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white transition-all flex items-center justify-center gap-3">
                  Learn more about N-Zyme 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className="border border-[#cba358] text-[#cba358] px-6 py-4 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#cba358] hover:text-black transition-all">
                  Get in touch
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE CARACTERÍSTICAS (Fondo Blanco) */}
        <section className="bg-white text-black py-24 px-6 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {/* Science */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
              <div className="text-[#cba358]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20m0-20c2-2 6 0 6 3s-4 4-6 4-6-1-6-4 4-5 6-3zm0 20c2 2 6 0 6-3s-4-4-6-4-6 1-6 4 4 5 6 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-3">Science</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">Advancing breakthrough science to address the root cause of reflux disease.</p>
              </div>
            </div>
            
            {/* Mission */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
              <div className="text-[#cba358]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M3 12h18m-9-9c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-3">Mission</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">Developing first-in-class therapeutics that redefine the standard of care.</p>
              </div>
            </div>
            
            {/* Impact */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
              <div className="text-[#cba358]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9zm18 0c0-1.12-.13-2.19-.36-3.23l-3.26 3.26M12 3v18m-9-9h18" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-3">Impact</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">Improving the lives of millions affected by reflux and airway diseases worldwide.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CTA (Banner Negro) */}
        <section className="bg-white px-6 pb-24 relative z-20">
          <div className="max-w-7xl mx-auto bg-[#111] text-white rounded-xl p-10 md:p-16 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-1 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#cba358]">The Future of Reflux Treatment</p>
                <div className="w-12 h-[1px] bg-[#cba358] mb-4" />
                <h2 className="font-serif text-3xl md:text-4xl leading-tight">Let's Build the Future of Reflux Treatment.</h2>
              </div>
              
              <div className="md:col-span-1 space-y-6">
                <p className="text-sm font-light text-gray-300 leading-relaxed">I connect with investors, operators, and innovators who share the vision of creating meaningful impact through science.</p>
                <button className="bg-[#cba358] text-black px-6 py-4 rounded-[4px] font-semibold text-xs tracking-[0.15em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 w-fit">
                  Start a conversation 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              
              <div className="md:col-span-1 md:border-l md:border-gray-800 md:pl-10 space-y-4">
                <div className="text-[#cba358]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-2">N-Zyme Biomedical</h3>
                  <p className="text-xs font-light text-gray-400 mb-4">Building the first pepsin inhibitor for reflux.</p>
                  <a href="#" className="text-xs font-semibold tracking-[0.1em] text-gray-300 hover:text-[#cba358] transition-colors flex items-center gap-2 uppercase">
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