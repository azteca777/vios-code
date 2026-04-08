import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 📡 IMPORTACIÓN DEL CONECTOR

// 🛡️ Inicializar Supabase con privilegios de administrador (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DOMINIOS_PERMITIDOS = [
  'https://virtualuxurytulum.com',
  'https://www.virtualuxurytulum.com',
  'https://vioscode.io',
  'https://www.vioscode.io',
  'https://virtualuniverse.com',
  'https://tianguistulum.com',
  'https://www.tianguistulum.com',
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
    // 👁️ NUEVO: Capturamos la variable "tienda" que mandan los clientes
    const { src_file_url, ref_file_url, tipoPrenda = 'cloth', gender, tienda } = body;

    if (!src_file_url || !ref_file_url) {
      let errorRes = NextResponse.json({ error: 'Faltan URLs de imagen en la Matrix' }, { status: 400 });
      return agregarCors(errorRes, origin);
    }

    const apiKey = process.env.YOUCAM_API_KEY_SECRET;
    if (!apiKey) {
      let errorRes = NextResponse.json({ error: 'Error de configuración en ViOs Code' }, { status: 500 });
      return agregarCors(errorRes, origin);
    }

    // 📊 LÓGICA DE CONTADOR SAAS (Sumar +1 uso al espejo)
    if (tienda) {
      // 1. Buscamos al cliente en la base de datos por su nombre de marca
      const { data: clienteData, error: fetchError } = await supabase
        .from('clientes_saas')
        .select('id, espejo_usos_mes_actual, limite_espejo_mensual')
        .eq('nombre_marca', tienda) // Tiene que coincidir exactamente con el nombre en Supabase (ej. MULATA)
        .single();

      if (!fetchError && clienteData) {
        // 2. Si existe, le sumamos 1 al uso actual
        const nuevoUso = (clienteData.espejo_usos_mes_actual || 0) + 1;
        
        // 3. Opcional: Podrías bloquear la petición aquí si nuevoUso > limite_espejo_mensual
        
        // 4. Guardamos el nuevo número en la base de datos
        await supabase
          .from('clientes_saas')
          .update({ espejo_usos_mes_actual: nuevoUso })
          .eq('id', clienteData.id);
          
        console.log(`📊 Contador actualizado para ${tienda}: ${nuevoUso}`);
      } else {
        console.log(`⚠️ Cliente SaaS no encontrado o sin plan de espejo: ${tienda}`);
      }
    }

    // 🚀 ENDPOINT DINÁMICO PARA EL POST (cloth o hat)
    const YOUCAM_ENDPOINT = `https://yce-api-01.makeupar.com/s2s/v2.0/task/${tipoPrenda}`;

    // Armamos el paquete base estrictamente como pide la documentación
    const payload: any = {
      src_file_url: src_file_url,
      ref_file_url: ref_file_url
    };

    // Separación perfecta: Sombreros vs Ropa
    if (tipoPrenda === 'hat') {
      payload.gender = gender || "male"; 
      payload.style = "style_urban_fashion"; 
    } else {
      payload.garment_category = "auto";
    }

    console.log("📦 ENVIANDO A YOUCAM:", JSON.stringify(payload));

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

// 👇 LA FUNCIÓN GET (POLLING) SE QUEDA IGUAL 👇
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && !DOMINIOS_PERMITIDOS.includes(origin)) {
    return NextResponse.json({ error: 'Dominio no autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  
  const tipoPrenda = searchParams.get('tipoPrenda') || 'cloth'; 

  if (!taskId) {
    let errorRes = NextResponse.json({ error: 'Falta el ticket (taskId)' }, { status: 400 });
    return agregarCors(errorRes, origin);
  }

  const apiKey = process.env.YOUCAM_API_KEY_SECRET;
  
  const YOUCAM_ENDPOINT = `https://yce-api-01.makeupar.com/s2s/v2.0/task/${tipoPrenda}/${taskId}`;

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