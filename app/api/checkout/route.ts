import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// 🛡️ Permisos de seguridad para que tus tiendas puedan pedir links (CORS)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Permite que cualquier tienda tuya se conecte
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Esta función es para que los navegadores pregunten si es seguro conectarse
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { carrito, tienda } = body; 

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
        auto_return: 'approved',
      }
    });

    return NextResponse.json({ urlPago: result.init_point }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error creando pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}