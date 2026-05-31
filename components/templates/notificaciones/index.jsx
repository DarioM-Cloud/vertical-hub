'use client';

import { useState, useEffect } from 'react';
import { Bell, UserPlus, Check, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import Container from '@/components/_base/layout/container';
import styles from './notificaciones.module.scss';

export default function NotificacionesTemplate() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'notificaciones'), where('receptorId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => (b.fecha?.toMillis?.() || 0) - (a.fecha?.toMillis?.() || 0));
      setNotificaciones(fetched);
    });

    return () => unsub();
  }, [user]);

  const marcarComoLeida = async (id) => {
    try {
      await updateDoc(doc(db, 'notificaciones', id), { leida: true });
    } catch (error) {}
  };

  const aceptarSolicitud = async (notif) => {
    try {
      await addDoc(collection(db, 'amistades'), {
        usuarios: [user.uid, notif.emisorId],
        fecha: serverTimestamp()
      });
      await deleteDoc(doc(db, 'notificaciones', notif.id));
    } catch (error) {}
  };

  const rechazarSolicitud = async (id) => {
    try {
      await deleteDoc(doc(db, 'notificaciones', id));
    } catch (error) {}
  };

  return (
    <Container className={styles.container}>
      <div className={styles.header}>
        <Bell size={24} />
        <h1 className={styles.title}>Notificaciones</h1>
      </div>

      <div className={styles.list}>
        {notificaciones.length === 0 ? (
          <div className={styles.empty}>No tienes notificaciones nuevas.</div>
        ) : (
          notificaciones.map(n => (
            <div 
              key={n.id} 
              className={`${styles.card} ${!n.leida ? styles.unread : ''}`}
              onClick={() => !n.leida && marcarComoLeida(n.id)}
            >
              <div 
                className={styles.avatar} 
                style={{ backgroundImage: `url(${n.emisorFoto || ''})` }}
              >
                {!n.emisorFoto && <UserPlus size={16} />}
              </div>
              <div className={styles.content}>
                {n.tipo === 'solicitud_amistad' && (
                  <>
                    <p>
                      <strong>{n.emisorNombre}</strong> quiere conectar contigo.
                    </p>
                    <div className={styles.actions}>
                      <button 
                        className={styles.acceptBtn} 
                        onClick={(e) => { e.stopPropagation(); aceptarSolicitud(n); }}
                      >
                        <Check size={14} /> Aceptar
                      </button>
                      <button 
                        className={styles.rejectBtn} 
                        onClick={(e) => { e.stopPropagation(); rechazarSolicitud(n.id); }}
                      >
                        <X size={14} /> Rechazar
                      </button>
                    </div>
                  </>
                )}
                {n.tipo === 'nuevo_amigo' && (
                  <p>Ahora estás conectado con <strong>{n.emisorNombre}</strong>.</p>
                )}
                <span className={styles.time}>
                  {n.fecha?.toDate ? n.fecha.toDate().toLocaleDateString() : 'Reciente'}
                </span>
              </div>
              {!n.leida && <div className={styles.unreadDot}></div>}
            </div>
          ))
        )}
      </div>
    </Container>
  );
}