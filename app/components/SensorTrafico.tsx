'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión a tu Bóveda (asegúrate de que el proyecto donde lo uses tenga estas variables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SensorTrafico({ marca }: { marca: string }) {
  const registrado = useRef(false);

  useEffect(() => {
    // Esto evita que cuente doble cuando estás programando en modo desarrollo
    if (registrado.current) return; 
    registrado.current = true;

    async function registrarVisita() {
      // Manda el "ping" silencioso a Supabase
      await supabase.from('trafico_diario').insert([{ tienda_id: marca }]);
    }
    
    registrarVisita();
  }, [marca]);

  return null; // 🥷 100% Invisible para el usuario final
}