'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const restaurarRocodromos = async () => {
    setLoading(true);
    setMensaje('');
    
    try {
      const rocodromos = [
        {
          id: '9a-murcia',
          nombre: '9a Murcia',
          ubicacion: 'Murcia',
          lat: 37.9870,
          lng: -1.1300,
          aforoMaximo: 110,
          aforoActual: 0,
          numSectores: 14,
          tieneVias: true,
          modalidades: ['boulder', 'vias', 'entrenamiento'],
          servicios: ['cafeteria', 'alquiler', 'tienda']
        },
        {
          id: 'arkose-madrid',
          nombre: 'Arkose Madrid',
          ubicacion: 'Madrid',
          lat: 40.4168,
          lng: -3.7038,
          aforoMaximo: 150,
          aforoActual: 0,
          numSectores: 18,
          tieneVias: false,
          modalidades: ['boulder', 'entrenamiento'],
          servicios: ['restaurante', 'coworking', 'alquiler']
        }
      ];

      for (const roco of rocodromos) {
        let urlFinal = '';

        try {
          const imageRef = ref(storage, `rocodromos/${roco.id}.jpg`);
          urlFinal = await getDownloadURL(imageRef);
        } catch (e) {
          urlFinal = `/${roco.id}.jpg`;
        }

        const dataToSave = {
          ...roco,
          imagenUrl: urlFinal
        };

        await setDoc(doc(db, 'rocodromos', roco.id), dataToSave);
      }

      setMensaje('Rocódromos creados con sus IDs personalizados y fotos vinculadas.');
    } catch (error) {
      setMensaje('Error al restaurar: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <Container style={{ padding: '80px 20px', textAlign: 'center', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Restaurar Rocódromos Borrados</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Haz clic en el botón inferior para reinsertar los rocódromos vinculando automáticamente las imágenes de la carpeta rocodromos/ y fijando el ID del documento con el nombre del rocódromo.
      </p>
      
      <Button onClick={restaurarRocodromos} disabled={loading} variant="primary">
        {loading ? 'Restaurando e insertando...' : 'Restaurar Rocódromos'}
      </Button>
      
      {mensaje && (
        <p style={{ marginTop: '24px', fontWeight: '700', color: mensaje.includes('Error') ? '#ef4444' : '#10b981' }}>
          {mensaje}
        </p>
      )}
    </Container>
  );
}