'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AdminRolesPage() {
  const { user, loading } = useAuth();
  const [targetUid, setTargetUid] = useState('');
  const [role, setRole] = useState('user');
  const [rocoId, setRocoId] = useState('');
  const [rocodromos, setRocodromos] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchRocos = async () => {
      const snap = await getDocs(collection(db, 'rocodromos'));
      setRocodromos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchRocos();
  }, []);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!targetUid) return;

    try {
      setStatus('Actualizando privilegios...');
      const userRef = doc(db, 'usuarios', targetUid);
      await updateDoc(userRef, {
        rol: role,
        adminRocoId: role === 'rocoadmin' ? rocoId : null
      });
      setStatus('Rol guardado con éxito.');
      setTargetUid('');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  if (loading) return null;

  if (!user?.isSuperAdmin) {
    return (
      <Container style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>Acceso Restringido</h2>
        <p>Esta zona requiere credenciales de Super Administrador General.</p>
      </Container>
    );
  }

  return (
    <Container style={{ padding: '120px 20px', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '800' }}>Panel Global de Roles</h1>
      <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>UID del Usuario</label>
          <input
            type="text"
            value={targetUid}
            onChange={(e) => setTargetUid(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
            placeholder="Introduce el UID de Firebase Auth..."
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Asignar Rango</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}
          >
            <option value="user">Usuario Estándar</option>
            <option value="rocoadmin">Administrador de Rocódromo</option>
            <option value="superadmin">Super Administrador General</option>
          </select>
        </div>

        {role === 'rocoadmin' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Asignar Instalación</label>
            <select
              value={rocoId}
              onChange={(e) => setRocoId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}
              required
            >
              <option value="">Selecciona el centro deportivo...</option>
              {rocodromos.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
          Confirmar Cambios
        </Button>
        
        {status && (
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontWeight: '600', color: '#475569', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            {status}
          </div>
        )}
      </form>
    </Container>
  );
}