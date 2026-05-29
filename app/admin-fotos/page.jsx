'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';

export default function AdminFotosPage() {
  const [estadoProceso, setEstadoProceso] = useState('Esperando para iniciar...');

  const listaRocodromos = [
    { idFirestore: '9a-murcia', nombreArchivo: '9a-murcia.jpg' },
    { idFirestore: 'arkose-madrid', nombreArchivo: 'arkose-madrid.jpg' },
    { idFirestore: 'beclimb-malaga', nombreArchivo: 'beclimb-malaga.jpg' },
    { idFirestore: 'biwak', nombreArchivo: 'biwak.jpg' },
    { idFirestore: 'campobase-burgos', nombreArchivo: 'campobase-burgos.jpg' },
    { idFirestore: 'cereza-wall', nombreArchivo: 'cereza-wall.png' },
    { idFirestore: 'climbat-madrid', nombreArchivo: 'climbat-madrid.jpg' },
    { idFirestore: 'flashh-bcn', nombreArchivo: 'flashh-bcn.png' },
    { idFirestore: 'geko-valladolid', nombreArchivo: 'geko-valladolid.jpg' },
    { idFirestore: 'hangar-4', nombreArchivo: 'hangar-4.jpeg' },
    { idFirestore: 'indoorwall-bilbao', nombreArchivo: 'indoorwall-bilbao.png' },
    { idFirestore: 'natural-climb', nombreArchivo: 'natural-climb.jpg' },
    { idFirestore: 'rocopolis', nombreArchivo: 'rocopolis.jpg' },
    { idFirestore: 'sharma-bcn', nombreArchivo: 'sharma-bcn.jpg' },
    { idFirestore: 'skala-burgos', nombreArchivo: 'skala-burgos.jpg' },
    { idFirestore: 'soul-climb', nombreArchivo: 'soul-climb.jpg' },
    { idFirestore: 'sputnik-las-rozas', nombreArchivo: 'sputnik-las-rozas.jpg' },
    { idFirestore: 'the-wall-alicante', nombreArchivo: 'the-wall-alicante.jpg' }
  ];

  const ejecutarVinculacion = async () => {
    setEstadoProceso('Procesando imágenes, por favor espera...');

    for (const rocodromo of listaRocodromos) {
      try {
        const referenciaImagen = ref(storage, `rocodromos/${rocodromo.nombreArchivo}`);
        const urlDescarga = await getDownloadURL(referenciaImagen);

        const referenciaDocumento = doc(db, 'rocodromos', rocodromo.idFirestore);
        await updateDoc(referenciaDocumento, { imagenUrl: urlDescarga });

        console.log(`Éxito: ${rocodromo.idFirestore} enlazado correctamente.`);
      } catch (error) {
        console.error(`Fallo en ${rocodromo.idFirestore}:`, error);
      }
    }

    setEstadoProceso('¡Proceso finalizado! Revisa la consola del navegador por si hay errores.');
  };

  return (
    <Container style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#0f172a' }}>
        Vinculador de Fotos a Firestore
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: '1.5' }}>
        Asegúrate de que las 18 fotos están subidas en la carpeta <strong>rocodromos</strong> de tu Storage antes de pulsar el botón.
      </p>
      
      <Button variant="primary" onClick={ejecutarVinculacion} style={{ width: '100%', marginBottom: '24px' }}>
        Iniciar Vinculación
      </Button>

      <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '12px', fontWeight: '600', color: '#334155' }}>
        {estadoProceso}
      </div>
    </Container>
  );
}