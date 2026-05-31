'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Clock, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './buscadorUsuarios.module.scss';

export default function BuscadorUsuariosTemplate() {
  const { user } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'usuarios'), where('rol', 'in', ['user', undefined, null]));
        const snap = await getDocs(q);
        const fetched = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.id !== user?.uid && u.rol !== 'superadmin' && u.rol !== 'rocoadmin');
        
        setUsuarios(fetched);
      } catch (error) {}
      setLoading(false);
    };

    if (user) {
      fetchUsuarios();
    }
  }, [user]);

  const enviarSolicitud = async (receptor) => {
    try {
      await addDoc(collection(db, 'notificaciones'), {
        emisorId: user.uid,
        emisorNombre: user.nombre || user.email,
        emisorFoto: user.fotoPerfil || '',
        receptorId: receptor.id,
        tipo: 'solicitud_amistad',
        leida: false,
        fecha: serverTimestamp()
      });
      setSolicitudesEnviadas([...solicitudesEnviadas, receptor.id]);
    } catch (error) {}
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className={styles.container}>
      <h1 className={styles.title}>Encontrar Escaladores</h1>
      
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o email..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.usersGrid}>
        {loading ? (
          <p className={styles.empty}>Buscando escaladores...</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className={styles.empty}>No se encontraron usuarios.</p>
        ) : (
          usuariosFiltrados.map(u => (
            <div key={u.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <div 
                  className={styles.avatar} 
                  style={{ backgroundImage: `url(${u.fotoPerfil || ''})` }}
                >
                  {!u.fotoPerfil && <Users size={20} />}
                </div>
                <div className={styles.details}>
                  <span className={styles.name}>{u.nombre || 'Usuario sin nombre'}</span>
                  <span className={styles.email}>{u.email}</span>
                </div>
              </div>
              <Button 
                variant={solicitudesEnviadas.includes(u.id) ? 'outline' : 'primary'}
                onClick={() => enviarSolicitud(u)}
                disabled={solicitudesEnviadas.includes(u.id)}
                className={styles.actionBtn}
              >
                {solicitudesEnviadas.includes(u.id) ? (
                  <><Clock size={16} /> Enviada</>
                ) : (
                  <><UserPlus size={16} /> Conectar</>
                )}
              </Button>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}