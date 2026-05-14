'use client';

import { useState, useEffect } from 'react';
import { supabaseKetzzal } from '@/lib/supabase';

interface KetzzalBatch {
  id: string;
  batch_name: string;
  sku_reference: string;
}

export default function AdminKetzzalDashboard() {
  const [batches, setBatches] = useState<KetzzalBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Cargar los lotes disponibles para el selector
    const fetchBatches = async () => {
      const { data } = await supabaseKetzzal
        .from('ketzzal_batches')
        .select('id, batch_name, sku_reference');
      
      if (data) setBatches(data);
    };
    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !title || !description || !file) {
      alert('Por favor completa todos los campos y selecciona una foto.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Subir la imagen al bucket 'ketzzal_traceability'
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `updates/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabaseKetzzal.storage
        .from('ketzzal_traceability')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener la URL pública de la imagen
      const { data: { publicUrl } } = supabaseKetzzal.storage
        .from('ketzzal_traceability')
        .getPublicUrl(filePath);

      // 2. Guardar el registro en la tabla de trazabilidad
      const { error: insertError } = await supabaseKetzzal
        .from('ketzzal_batch_updates')
        .insert([
          {
            batch_id: selectedBatch,
            title,
            description,
            image_url: publicUrl,
          }
        ]);

      if (insertError) throw insertError;

      alert('¡Trazabilidad actualizada con éxito!');
      // Limpiar formulario
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Hubo un error al subir la actualización.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5DC] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 border-b border-[#1A3626] pb-6">
          <h1 className="text-4xl font-light tracking-wide text-[#F5F5DC]">
            Panel de <span className="font-bold text-[#2C5E43]">Control Operativo</span>
          </h1>
          <p className="text-[#A3A380] mt-2 text-sm uppercase tracking-widest">
            ViOs RWA • Gestión de Trazabilidad Ketzzal
          </p>
        </header>

        <div className="bg-[#0A0D0B] border border-[#1A3626] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-medium mb-6 text-[#E8E8D0]">Registrar Nueva Evidencia</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Selector de Lote */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A9A86] mb-2">Lote Activo</label>
              <select 
                value={selectedBatch} 
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A3626] rounded-lg p-4 text-[#F5F5DC] focus:outline-none focus:border-[#2C5E43] transition-colors appearance-none"
              >
                <option value="">-- Selecciona el lote en producción --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batch_name} ({b.sku_reference})</option>
                ))}
              </select>
            </div>

            {/* Título del Hito */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A9A86] mb-2">Título de la Actualización</label>
              <input 
                type="text" 
                placeholder="Ej. Llegada de 50kg de Habanero Tatemado"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A3626] rounded-lg p-4 text-[#F5F5DC] focus:outline-none focus:border-[#2C5E43] transition-colors"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A9A86] mb-2">Detalles Operativos</label>
              <textarea 
                rows={4}
                placeholder="Describe el proceso, costos o cualquier detalle relevante para los inversores..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A3626] rounded-lg p-4 text-[#F5F5DC] focus:outline-none focus:border-[#2C5E43] transition-colors resize-none"
              />
            </div>

            {/* Subida de Imagen */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A9A86] mb-2">Evidencia Fotográfica</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A3626] file:text-[#F5F5DC] hover:file:bg-[#2C5E43] cursor-pointer text-[#8A9A86] transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full mt-8 bg-[#2C5E43] text-[#050505] font-bold text-lg py-4 rounded-xl hover:bg-[#3A7A57] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(44,94,67,0.2)]"
            >
              {isUploading ? 'ENCRIPTANDO Y SUBIENDO EVIDENCIA...' : 'PUBLICAR ACTUALIZACIÓN EN LA BLOCKCHAIN'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}