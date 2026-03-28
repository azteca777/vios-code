import { NextResponse } from 'next/server';

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
    const { src_file_url, ref_file_url, tipoPrenda = 'cloth' } = body;

    if (!src_file_url || !ref_file_url) {
      let errorRes = NextResponse.json({ error: 'Faltan URLs de imagen en la Matrix' }, { status: 400 });
      return agregarCors(errorRes, origin);
    }

    const apiKey = process.env.YOUCAM_API_KEY_SECRET;
    if (!apiKey) {
      let errorRes = NextResponse.json({ error: 'Error de configuración en ViOs Code' }, { status: 500 });
      return agregarCors(errorRes, origin);
    }

    const YOUCAM_ENDPOINT = `https://yce-api-01.makeupar.com/s2s/v2.0/task/${tipoPrenda}`;

    const payload = {
      src_file_url: src_file_url,
      ref_file_url: ref_file_url,
      garment_category: "auto"
    };

    const youcamResponse = await fetch(YOUCAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    });

    const data = await youcamResponse.json();
    console.log("🤖 RESPUESTA INICIAL DE YOUCAM:", JSON.stringify(data, null, 2));

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

// 👇 LA NUEVA FUNCIÓN PARA CONSULTAR EL TICKET (POLLING) 👇
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && !DOMINIOS_PERMITIDOS.includes(origin)) {
    return NextResponse.json({ error: 'Dominio no autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    let errorRes = NextResponse.json({ error: 'Falta el ticket (taskId)' }, { status: 400 });
    return agregarCors(errorRes, origin);
  }

  const apiKey = process.env.YOUCAM_API_KEY_SECRET;
  // Endpoint de YouCam para consultar el status de una tarea
  const YOUCAM_ENDPOINT = `https://yce-api-01.makeupar.com/s2s/v2.0/task/cloth/${taskId}`;

  try {
    const youcamResponse = await fetch(YOUCAM_ENDPOINT, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    const data = await youcamResponse.json();
    return agregarCors(NextResponse.json(data), origin);

  } catch (error: any) {
    console.log("Error consultando ticket:", error);
    let catchRes = NextResponse.json({ error: 'Fallo al consultar el ticket en YouCam' }, { status: 500 });
    return agregarCors(catchRes, origin);
  }
}