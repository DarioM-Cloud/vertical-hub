'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import Button from '@/components/_base/ui/button';
import Container from '@/components/_base/layout/container';

const viasMuestra = [
  { via: "El Techo del Mono", grado: "V5", rocodromo: "Skala", tipo: "Boulder" },
  { via: "Placa Inclinada", grado: "6b+", rocodromo: "Campobase", tipo: "Deportiva" },
  { via: "Diedro Clásico", grado: "V4", rocodromo: "Skala", tipo: "Boulder" },
  { via: "Fisura Loca", grado: "6a", rocodromo: "Sputnik Las Rozas", tipo: "Deportiva" },
  { via: "Bloque Rojo", grado: "V3", rocodromo: "Rockland", tipo: "Boulder" },
  { via: "Desplome", grado: "7a", rocodromo: "Sharma Climbing", tipo: "Deportiva" }
];

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog(prev => [...prev, message]);
  };

  const handleCreateLogbook = async () => {
    setLoading(true);
    setLog([]);
    addLog("Obteniendo usuarios actuales...");

    try {
      const usersSnap = await getDocs(collection(db, 'usuarios'));
      
      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        addLog(`Generando actividad para: ${userDoc.data().nombre}`);
        
        const numAscensiones = Math.floor(Math.random() * 5) + 2;
        let gradoMaximo = "V1";
        
        for (let i = 0; i < numAscensiones; i++) {
          const viaRandom = viasMuestra[Math.floor(Math.random() * viasMuestra.length)];
          
          await addDoc(collection(db, 'ascensiones'), {
            userId: uid,
            via: viaRandom.via,
            grado: viaRandom.grado,
            rocodromo: viaRandom.rocodromo,
            tipo: viaRandom.tipo,
            fecha: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
          });

          gradoMaximo = viaRandom.grado;
        }

        await updateDoc(doc(db, 'usuarios', uid), {
          stats: {
            totalAscensiones: Math.floor(Math.random() * 150) + 10,
            gradoMaximo: gradoMaximo,
            amigos: Math.floor(Math.random() * 50)
          }
        });
      }
      
      setDone(true);
      addLog("🎉 ¡Logbook y estadísticas generados con éxito!");
    } catch (error) {
      console.error(error);
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '600px' }}>
      <h1>Generar Actividad y Logbook</h1>
      <p style={{ marginBottom: '24px', color: '#64748b' }}>
        Este script leerá tus usuarios y les añadirá ascensiones reales y estadísticas a su perfil.
      </p>
      
      <Button onClick={handleCreateLogbook} disabled={loading || done} style={{ width: '100%', marginBottom: '24px' }}>
        {loading ? 'Generando...' : done ? '¡Completado!' : 'Generar Logbook'}
      </Button>

      <div style={{
        background: '#0f172a', color: '#10b981', padding: '16px',
        borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px',
        minHeight: '200px', maxHeight: '400px', overflowY: 'auto'
      }}>
        {log.length === 0 ? "Esperando ejecución..." : log.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '4px' }}>{msg}</div>
        ))}
      </div>
    </Container>
  );
}