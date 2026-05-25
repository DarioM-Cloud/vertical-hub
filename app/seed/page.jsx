'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '@/components/_base/ui/button';
import Container from '@/components/_base/layout/container';

const sectoresMap = {
  "sputnik-las-rozas": 18,
  "sharma-bcn": 16,
  "rocopolis": 14,
  "arkose-madrid": 12,
  "climbat-madrid": 12,
  "flashh-bcn": 11,
  "biwak": 10,
  "indoorwall-bilbao": 10,
  "hangar-4": 9,
  "the-wall-alicante": 9,
  "beclimb-malaga": 8,
  "natural-climb": 8,
  "9a-murcia": 8,
  "cereza-wall": 7,
  "soul-climb": 7,
  "campobase-burgos": 6,
  "geko-valladolid": 6,
  "skala-burgos": 5
};

const zonas = ['Desplome', 'Placa', 'Cueva', 'Proa', 'Diedro', 'Competición'];
const grados = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
  'IV', 'V', 'V+', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a'
];
const colores = [
  { hex: '#ef4444', nombre: 'Rojo' },
  { hex: '#3b82f6', nombre: 'Azul' },
  { hex: '#10b981', nombre: 'Verde' },
  { hex: '#f59e0b', nombre: 'Amarillo' },
  { hex: '#0f172a', nombre: 'Negro' },
  { hex: '#ffffff', nombre: 'Blanco' }
];

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeedTodo = async () => {
    setLoading(true);
    try {
      const rocodromosSnap = await getDocs(collection(db, 'rocodromos'));
      
      for (const rocoDoc of rocodromosSnap.docs) {
        const rocoId = rocoDoc.id;
        const numSectores = sectoresMap[rocoId] || 8;

        for (let i = 0; i < numSectores; i++) {
          const isEquipping = Math.random() > 0.8;
          const nombreSector = `Sector ${String.fromCharCode(65 + i)}`;
          const viasEnSector = Math.floor(Math.random() * 6) + 4;

          await addDoc(collection(db, 'sectores'), {
            rocodromoId: rocoId,
            nombre: nombreSector,
            zona: zonas[Math.floor(Math.random() * zonas.length)],
            viasCount: viasEnSector,
            viasNuevas: Math.floor(Math.random() * 3),
            gradoPredominante: grados[Math.floor(Math.random() * grados.length)],
            estado: isEquipping ? 'Equipando' : 'Abierto',
            diasRenovacion: Math.floor(Math.random() * 30) + 1
          });

          if (!isEquipping) {
            for (let j = 0; j < viasEnSector; j++) {
              const colorObj = colores[Math.floor(Math.random() * colores.length)];
              const grado = grados[Math.floor(Math.random() * grados.length)];

              await addDoc(collection(db, 'vias'), {
                rocodromoId: rocoId,
                nombre: `Bloque ${j + 1}`,
                grado: grado,
                colorHex: colorObj.hex,
                colorNombre: colorObj.nombre,
                sector: nombreSector,
                fechaCreacion: serverTimestamp()
              });
            }
          }
        }
      }
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: '100px', textAlign: 'center' }}>
      <h1>Poblar Estructura de Competencia</h1>
      <p style={{ marginBottom: '24px', color: '#64748b' }}>
        Genera simultáneamente los sectores y sus respectivas vías vinculadas en Firestore.
      </p>
      <Button onClick={handleSeedTodo} disabled={loading || done}>
        {loading ? 'Insertando estructura...' : done ? '¡Datos creados!' : 'Generar Sectores y Vías'}
      </Button>
    </Container>
  );
}