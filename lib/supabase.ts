import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// ------------------------------------------------------------------
// 1. CLIENTE DE COPPER (Se mantiene intacto para no afectar la app)
// ------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_COPPER_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_COPPER_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ------------------------------------------------------------------
// 2. CLIENTE DE SALSAS KETZZAL (Actualizado a SSR para el Login)
// ------------------------------------------------------------------
const supabaseKetzzalUrl = process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_URL!;
const supabaseKetzzalAnonKey = process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_ANON_KEY!;

// Usamos createBrowserClient para que se sincronice con el middleware
export const supabaseKetzzal = createBrowserClient(supabaseKetzzalUrl, supabaseKetzzalAnonKey);