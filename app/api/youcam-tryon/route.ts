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
    // 👇 AQUÍ ESTÁ LA MAGIA QUE EVITA EL BLOQUEO EN VERCEL 👇
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
    const { userPhotoBase64, referenceImageUrl } = body;

    if (!userPhotoBase64 || !referenceImageUrl) {
      let errorRes = NextResponse.json({ error: 'Faltan datos de imagen' }, { status: 400 });
      return agregarCors(errorRes, origin);
    }

    const apiKey = process.env.YOUCAM_API_KEY_SECRET;
    if (!apiKey) {
      let errorRes = NextResponse.json({ error: 'Error de configuración en ViOs Code' }, { status: 500 });
      return agregarCors(errorRes, origin);
    }

    // 🔗 USAMOS EL ENDPOINT MULTIPART QUE ACEPTA BASE64 NATIVO EN 1 PASO
    const YOUCAM_ENDPOINT = 'https://api.perfectcorp.com/v1/virtual-tryon';

    // 📦 EMPAQUETAMOS LOS DATOS COMO FORMULARIO PARA YOUCAM
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('reference_image_url', referenceImageUrl);
    formData.append('user_photo_base64', userPhotoBase64);

    // 🛡️ LLAMADA A YOUCAM
    const youcamResponse = await fetch(YOUCAM_ENDPOINT, {
      method: 'POST',
      body: formData, // No lleva Content-Type, Fetch lo calcula automático
    });

    const data = await youcamResponse.json();
    
    // 🚨 RADAR DE DEBUGGING PARA VERCEL
    console.log("🤖 RESPUESTA DE YOUCAM:", JSON.stringify(data, null, 2));

    if (!youcamResponse.ok) {
      let errorRes = NextResponse.json({ error: data.message || 'Error en YouCam' }, { status: youcamResponse.status });
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