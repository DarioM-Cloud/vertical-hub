'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';

export default function SeedPage() {
  const [status, setStatus] = useState('Esperando acción...');

  const listaAdmins = [
    { email: 'superadmin@verticalhub.com', pass: 'superAdmin', rol: 'superadmin', nombre: 'Super Admin', adminRocoId: null },
    { email: '9a-murciaadmin@verticalhub.com', pass: '9a-murciaAdmin', rol: 'rocoadmin', nombre: '9a Murcia Admin', adminRocoId: '9a-murcia' },
    { email: 'arkose-madridadmin@verticalhub.com', pass: 'arkose-madridAdmin', rol: 'rocoadmin', nombre: 'Arkose Madrid Admin', adminRocoId: 'arkose-madrid' },
    { email: 'beclimb-malagaadmin@verticalhub.com', pass: 'beclimb-malagaAdmin', rol: 'rocoadmin', nombre: 'BeClimb Málaga Admin', adminRocoId: 'beclimb-malaga' },
    { email: 'biwakadmin@verticalhub.com', pass: 'biwakAdmin', rol: 'rocoadmin', nombre: 'Biwak Admin', adminRocoId: 'biwak' },
    { email: 'campobase-burgosadmin@verticalhub.com', pass: 'campobase-burgosAdmin', rol: 'rocoadmin', nombre: 'Campo Base Burgos Admin', adminRocoId: 'campobase-burgos' },
    { email: 'cereza-walladmin@verticalhub.com', pass: 'cereza-wallAdmin', rol: 'rocoadmin', nombre: 'Cereza Wall Admin', adminRocoId: 'cereza-wall' },
    { email: 'climbat-madridadmin@verticalhub.com', pass: 'climbat-madridAdmin', rol: 'rocoadmin', nombre: 'Climbat Madrid Admin', adminRocoId: 'climbat-madrid' },
    { email: 'flashh-bcnadmin@verticalhub.com', pass: 'flashh-bcnAdmin', rol: 'rocoadmin', nombre: 'Flashh BCN Admin', adminRocoId: 'flashh-bcn' },
    { email: 'geko-valladolidadmin@verticalhub.com', pass: 'geko-valladolidAdmin', rol: 'rocoadmin', nombre: 'Geko Valladolid Admin', adminRocoId: 'geko-valladolid' },
    { email: 'hangar-4admin@verticalhub.com', pass: 'hangar-4Admin', rol: 'rocoadmin', nombre: 'Hangar 4 Admin', adminRocoId: 'hangar-4' },
    { email: 'indoorwall-bilbaoadmin@verticalhub.com', pass: 'indoorwall-bilbaoAdmin', rol: 'rocoadmin', nombre: 'Indoorwall Bilbao Admin', adminRocoId: 'indoorwall-bilbao' },
    { email: 'natural-climbadmin@verticalhub.com', pass: 'natural-climbAdmin', rol: 'rocoadmin', nombre: 'Natural Climb Admin', adminRocoId: 'natural-climb' },
    { email: 'rocopolisadmin@verticalhub.com', pass: 'rocopolisAdmin', rol: 'rocoadmin', nombre: 'Rocopolis Admin', adminRocoId: 'rocopolis' },
    { email: 'sharma-bcnadmin@verticalhub.com', pass: 'sharma-bcnAdmin', rol: 'rocoadmin', nombre: 'Sharma BCN Admin', adminRocoId: 'sharma-bcn' },
    { email: 'skala-burgosadmin@verticalhub.com', pass: 'skala-burgosAdmin', rol: 'rocoadmin', nombre: 'Skala Burgos Admin', adminRocoId: 'skala-burgos' },
    { email: 'soul-climbadmin@verticalhub.com', pass: 'soul-climbAdmin', rol: 'rocoadmin', nombre: 'Soul Climb Admin', adminRocoId: 'soul-climb' },
    { email: 'sputnik-las-rozasadmin@verticalhub.com', pass: 'sputnik-las-rozasAdmin', rol: 'rocoadmin', nombre: 'Sputnik Las Rozas Admin', adminRocoId: 'sputnik-las-rozas' },
    { email: 'the-wall-alicanteadmin@verticalhub.com', pass: 'the-wall-alicanteAdmin', rol: 'rocoadmin', nombre: 'The Wall Alicante Admin', adminRocoId: 'the-wall-alicante' }
  ];

  const procesarInyeccion = async () => {
    setStatus('Creando credenciales en Firebase Auth y Firestore...');

    for (const cuenta of listaAdmins) {
      try {
        const respuestaAuth = await createUserWithEmailAndPassword(auth, cuenta.email, cuenta.pass);
        await setDoc(doc(db, 'usuarios', respuestaAuth.user.uid), {
          nombre: cuenta.nombre,
          email: cuenta.email,
          rol: cuenta.rol,
          adminRocoId: cuenta.adminRocoId,
          fotoPerfil: ''
        });
      } catch (error) {
        if (error.code !== 'auth/email-already-in-use') {
          console.error(error);
        }
      }
    }

    await signOut(auth);
    setStatus('¡Proceso finalizado! Todos los administradores han sido creados.');
  };

  const resetearAforos = async () => {
    setStatus('Limpiando base de datos: Borrando ocupacionActual y seteando aforoActual a 0...');
    try {
      const rocoSnap = await getDocs(collection(db, 'rocodromos'));
      const actualizaciones = rocoSnap.docs.map(documento => 
        updateDoc(doc(db, 'rocodromos', documento.id), {
          aforoActual: 0,
          ocupacionActual: deleteField()
        })
      );
      
      await Promise.all(actualizaciones);
      setStatus('¡Datos saneados y aforos reseteados a 0 correctamente!');
    } catch (error) {
      setStatus('Error al actualizar los aforos.');
      console.error(error);
    }
  };

  return (
    <Container style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
        Panel de Inyección y Reseteo (Seed)
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
        Herramientas de desarrollo para sincronizar la base de datos de Vertical Hub.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <Button variant="primary" onClick={procesarInyeccion} style={{ width: '100%' }}>
          Ejecutar Inyección de Cuentas Admin
        </Button>

        <Button variant="outline" onClick={resetearAforos} style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}>
          Resetear Todos los Aforos a 0
        </Button>
      </div>

      <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '12px', fontWeight: '600', color: '#334155' }}>
        {status}
      </div>
    </Container>
  );
}