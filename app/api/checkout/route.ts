import { MercadoPagoConfig, Preference } from 'mercadopago';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🛡️ Inicializar Supabase con privilegios de administrador (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 💡 Aceptamos nuevas variables que vienen del frontend de tu agencia
    const { carrito, tienda, gateway = 'mercadopago', planName, amount, email, nombreNegocio } = body; 

    // ==========================================
    // 🏢 RUTA 3: SUSCRIPCIONES SAAS (TU AGENCIA)
    // ==========================================
    if (gateway === 'vios-subscription') {
      console.log(`Iniciando suscripción: ${planName} para ${nombreNegocio}`);
      
      // Asegúrate de que esta variable se llame exactamente como la tienes en tu .env.local
      // En tu captura vi que decía STRIPE_SECRET_KEY_TEST, así que uso esa por ahora.
      const stripeSaaS = new Stripe(process.env.STRIPE_SECRET_KEY_TEST as string, {
        apiVersion: '2023-10-16',
      });

      const session = await stripeSaaS.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email, 
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              product_data: {
                name: `Membresía ${planName} - ViOs Code`,
                description: `Suscripción SaaS para ${nombreNegocio}`,
              },
              unit_amount: amount * 100, // Centavos
              recurring: {
                interval: 'month', // 👈 Cobro mensual
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription', // 👈 Modo suscripción
        success_url: `https://vioscode.io/?pago=exitoso`,
        cancel_url: `https://vioscode.io/?pago=cancelado`,
      });

      return NextResponse.json({ urlPago: session.url }, { headers: corsHeaders });
    }

    // ==========================================
    // LÓGICA ORIGINAL PARA CLIENTES (VIRTUAL LUXURY)
    // ==========================================

    // 🧮 CALCULAR TOTALES Y TU COMISIÓN
    const PORCENTAJE_COMISION = 0.10;
    const totalVenta = carrito?.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0) || 0;
    const comisionCalculada = totalVenta * PORCENTAJE_COMISION;

    // 💾 GUARDAR REGISTRO EN SUPABASE ANTES DE COBRAR
    const { data: registroVenta, error: supabaseError } = await supabase
      .from('ventas')
      .insert([
        {
          tienda_id: tienda,
          total: totalVenta,
          metodo_pago: gateway,
          comision_vios: comisionCalculada,
          estado: 'intento_de_pago', 
          carrito: carrito
        }
      ])
      .select()
      .single();

    if (supabaseError) console.error("Error guardando en Supabase:", supabaseError);

    // ==========================================
    // 🌍 RUTA 1: MOTOR GLOBAL (STRIPE - PAGO ÚNICO)
    // ==========================================
    if (gateway === 'stripe') {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST as string, {
        apiVersion: '2023-10-16', 
      });

      const lineItems = carrito.map((producto: any) => ({
        price_data: {
          currency: 'mxn', 
          product_data: { name: producto.nombre },
          unit_amount: Math.round(Number(producto.precio) * 100), 
        },
        quantity: producto.cantidad,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        client_reference_id: registroVenta?.id, 
        success_url: `https://virtualuxurytulum.com/${tienda.toLowerCase()}?pago=exitoso`,
        cancel_url: `https://virtualuxurytulum.com/${tienda.toLowerCase()}?pago=cancelado`,
      });

      return NextResponse.json({ urlPago: session.url }, { headers: corsHeaders });
    }

    // ==========================================
    // 🇲🇽 RUTA 2: MOTOR LATAM (MERCADO PAGO)
    // ==========================================
    let tokenActivo = '';
    
    switch (tienda) {
      case 'LUKAS':
      case 'BERNARDITA':
      case 'MULATA':
      case 'OASIS':
      case 'vios_test': 
        tokenActivo = process.env.MP_TOKEN_VIOS || ''; 
        break;
      default:
        return NextResponse.json({ error: `Tienda no reconocida: ${tienda}` }, { status: 400, headers: corsHeaders });
    }

    const client = new MercadoPagoConfig({ accessToken: tokenActivo });
    const items = carrito.map((producto: any) => ({
      id: producto.id?.toString() || '1',
      title: producto.nombre,
      quantity: producto.cantidad,
      unit_price: Number(producto.precio),
      currency_id: 'MXN',
    }));

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        external_reference: registroVenta?.id, 
        back_urls: {
          success: `https://virtualuxurytulum.com/${tienda.toLowerCase()}`,
          failure: `https://virtualuxurytulum.com/${tienda.toLowerCase()}`,
          pending: `https://virtualuxurytulum.com/${tienda.toLowerCase()}`,
        },
        auto_return: 'approved',
      }
    });

    return NextResponse.json({ urlPago: result.init_point }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error creando pago en Matriz:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}