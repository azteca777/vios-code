import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { carrito, tienda } = body; 

    // 1. Seleccionamos el Token según la tienda que pide el cobro
    let tokenActivo = '';

    switch (tienda) {
      case 'vios_test':
        tokenActivo = process.env.MP_TOKEN_VIOS || ''; 
        break;
      // case 'gods_aesthetics':
      //   tokenActivo = process.env.MP_TOKEN_GODS_AESTHETICS || '';
      //   break;
      default:
        return NextResponse.json({ error: 'Tienda no reconocida' }, { status: 400 });
    }

    // 2. Inicializamos Mercado Pago con ese Token
    const client = new MercadoPagoConfig({ accessToken: tokenActivo });

    // 3. Formateamos el carrito de Next.js al formato de Mercado Pago
    const items = carrito.map((producto: any) => ({
      id: producto.id?.toString() || '1',
      title: producto.nombre,
      quantity: producto.cantidad,
      unit_price: Number(producto.precio),
      currency_id: 'MXN',
    }));

    // 4. Creamos la orden de cobro
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        auto_return: 'approved',
      }
    });

    // 5. Le devolvemos el link de pago seguro a la tienda
    return NextResponse.json({ urlPago: result.init_point });

  } catch (error: any) {
    console.error("Error creando pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}