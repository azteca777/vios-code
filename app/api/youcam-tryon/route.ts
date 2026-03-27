import { NextResponse } from 'next/server';

// 🛡️ LISTA VIP DE PRODUCCIÓN EN VERCEL
const DOMINIOS_PERMITIDOS = [
  'https://virtualuxurytulum.com',
  'https://www.virtualuxurytulum.com',
  'https://vioscode.io',
  'https://www.vioscode.io',
  'https://virtualuniverse.com',
  'http://localhost:3000', 
  'http://localhost:3001'
];

function agregarCors(res: NextResponse, origin: string | null) {
  if (origin && DOMINIOS_PERMITIDOS.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }
  return res;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && DOMINIOS_PERMITIDOS.includes(origin)) {
    return agregarCors(new NextResponse(null, { status: 200 }), origin);
  }
  return new NextResponse('Acceso denegado a ViOs Code Matrix', { status: 403 });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');

  if (origin && !DOMINIOS_PERMITIDOS.includes(origin)) {
    return NextResponse.json({ error: 'Dominio no autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userPhotoBase64, referenceImageUrl, tipoPrenda = 'cloth' } = body;

    if (!userPhotoBase64 || !referenceImageUrl) {
      let errorRes = NextResponse.json({ error: 'Faltan datos de imagen' }, { status: 400 });
      return agregarCors(errorRes, origin);
    }

    const apiKey = process.env.YOUCAM_API_KEY_SECRET;
    if (!apiKey) {
      let errorRes = NextResponse.json({ error: 'Error de configuración en ViOs Code' }, { status: 500 });
      return agregarCors(errorRes, origin);
    }

    // 🔗 LA URL OFICIAL DE YOUCAM V2 (¡Adiós al edificio fantasma!)
    const YOUCAM_ENDPOINT = `https://yce-api-01.makeupar.com/s2s/v2.0/task/${tipoPrenda}`;

    // 🧹 Limpiamos el texto de tu foto Base64 para que YouCam la acepte
    const base64Limpio = userPhotoBase64.includes(',') 
      ? userPhotoBase64.split(',')[1] 
      : userPhotoBase64;

    // 📦 EMPAQUETAMOS LOS DATOS EN JSON (Formato V2)
    const payload = {
      src_file_base64: base64Limpio,    // Tu foto subida
      ref_file_url: referenceImageUrl,  // La foto de tu traje de baño
      garment_category: "auto"          // Que la IA decida cómo ajustarlo
    };

    // 🛡️ LLAMADA A YOUCAM CON EL BEARER TOKEN CORRECTO
    const youcamResponse = await fetch(YOUCAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    });

    const data = await youcamResponse.json();
    
    // 🚨 RADAR DE DEBUGGING PARA VERCEL
    console.log("🤖 RESPUESTA DE YOUCAM:", JSON.stringify(data, null, 2));

    if (!youcamResponse.ok) {
      let errorRes = NextResponse.json({ error: data.message || data.error?.message || 'Error en YouCam' }, { status: youcamResponse.status });
      return agregarCors(errorRes, origin);
    }

    let successRes = NextResponse.json(data);
    return agregarCors(successRes, origin);

  } catch (error: any) {
    console.log("Error de conexión interno:", error);
    let catchRes = NextResponse.json({ error: 'Fallo en la conexión interdimensional de ViOs Code' }, { status: 500 });
    return agregarCors(catchRes, origin);
  }
}