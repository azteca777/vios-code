import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_COPPER_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_COPPER_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Cliente específico para la tokenización de Salsas Ketzzal
const supabaseKetzzalUrl = process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_URL!;
const supabaseKetzzalAnonKey = process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_ANON_KEY!;

export const supabaseKetzzal = createClient(supabaseKetzzalUrl, supabaseKetzzalAnonKey);