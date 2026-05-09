import type { Metadata } from "next";
// Importamos Cormorant_Garamond para la elegancia Serif, y mantenemos Montserrat
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

// 1. Configuramos Cormorant Garamond (Ideal para Títulos elegantes y Serif)
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Pesos necesarios para el diseño
  variable: '--font-cormorant',
  display: 'swap',
});

// 2. Configuramos Montserrat (Ideal para textos secundarios, botones y subtítulos finos)
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Pesos finos (300) y gruesos (700)
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ViOs Code | Matriz",
  description: "Redefiniendo la Realidad Digital de tu Negocio.",
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    other: {
      "facebook-domain-verification": "3821ytbjb2bml3tlcr9x4k3cjlmtin",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Inyectamos las dos nuevas fuentes (cormorant y montserrat) en la raíz
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      {/* Por defecto, podemos dejar Montserrat como la fuente principal sin serifas */}
      <body className="font-sans bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}