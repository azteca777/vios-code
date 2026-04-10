'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SensorProps {
  marca: string;
}

export default function SensorTrafico({ marca }: SensorProps) {
  const rastreado = useRef(false);

  useEffect(() => {
    // Evitar que registre dos veces en desarrollo (React Strict Mode)
    if (rastreado.current) return;
    rastreado.current = true;

    async function registrarVisita() {
      try {
        // 1. Intentamos conseguir la ubicación del visitante
        let ciudadVisitante = 'Desconocida';
        let paisVisitante = 'Desconocido';

        try {
          const respuestaUbicacion = await fetch('https://ipapi.co/json/');
          const datosUbicacion = await respuestaUbicacion.json();
          
          if (datosUbicacion.city) {
            ciudadVisitante = datosUbicacion.city;
            paisVisitante = datosUbicacion.country_name;
          }
        } catch (errorUbicacion) {
          console.log("No se pudo obtener la ubicación (bloqueador de anuncios o error de red).", errorUbicacion);
        }

        // 2. Disparamos la información a la Matriz (Supabase)
        const { error } = await supabase
          .from('trafico_diario')
          .insert([
            { 
              tienda_id: marca,
              ciudad: ciudadVisitante,
              pais: paisVisitante
            }
          ]);

        if (error) {
          console.error("Error al registrar tráfico:", error);
        } else {
          console.log(`📡 Ping de tráfico detectado en ${marca} desde ${ciudadVisitante}, ${paisVisitante}`);
        }
      } catch (err) {
        console.error("Error crítico en el sensor:", err);
      }
    }

    registrarVisita();
  }, [marca]);

  // Este componente es invisible, no renderiza nada en la pantalla
  return null;
}