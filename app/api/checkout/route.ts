import { MercadoPagoConfig, Preference } from 'mercadopago';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// 🛡️ Permisos de seguridad (CORS)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Inicializamos el motor Global (Stripe)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST as string, {
  apiVersion: '2023-10-16', // Versión estable de Stripe
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Agregamos 'gateway' para saber qué pasarela usar. Si no manda nada, usa mercadopago por defecto.
    const { carrito, tienda, gateway = 'mercadopago' } = body; 

    // ==========================================
    // 🌍 RUTA 1: MOTOR GLOBAL (STRIPE)
    // ==========================================
    if (gateway === 'stripe') {
      const lineItems = carrito.map((producto: any) => ({
        price_data: {
          currency: 'mxn', // Stripe cobra en centavos, así que multiplicamos por 100
          product_data: {
            name: producto.nombre,
          },
          unit_amount: Math.round(Number(producto.precio) * 100), 
        },
        quantity: producto.cantidad,
      }));

      // Creamos la sesión de cobro en Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://virtualuxurytulum.com/lukas?pago=exitoso',
        cancel_url: 'https://virtualuxurytulum.com/lukas?pago=cancelado',
      });

      return NextResponse.json({ urlPago: session.url }, { headers: corsHeaders });
    }

    // ==========================================
    // 🇲🇽 RUTA 2: MOTOR LATAM (MERCADO PAGO)
    // ==========================================
    let tokenActivo = '';
    switch (tienda) {
      case 'vios_test':
        tokenActivo = process.env.MP_TOKEN_VIOS || ''; 
        break;
      default:
        return NextResponse.json({ error: 'Tienda no reconocida' }, { status: 400, headers: corsHeaders });
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
        back_urls: {
          success: 'https://virtualuxurytulum.com/lukas',
          failure: 'https://virtualuxurytulum.com/lukas',
          pending: 'https://virtualuxurytulum.com/lukas',
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