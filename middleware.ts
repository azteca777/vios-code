// @ts-ignore
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Usamos las variables de Ketzzal para este flujo
  const supabase = createMiddlewareClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_KETZZAL_SUPABASE_ANON_KEY,
  });

  // Obtenemos la sesión correctamente en dos pasos para que TypeScript no se queje
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  // 1. Proteger las rutas de administración
  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Opcional: Proteger el marketplace para que solo inversores registrados lo vean
  if (req.nextUrl.pathname.startsWith('/ketzzal') && !session) {
     return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/ketzzal/:path*'],
};