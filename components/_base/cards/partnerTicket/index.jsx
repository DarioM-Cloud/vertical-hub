'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, UserCheck, UserPlus, MapPin, User, Activity, Hash, Calendar, MoreHorizontal, X } from 'lucide-react';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import styles from './partnerTicket.module.scss';

export default function PartnerTicket({ data, onDelete, onJoin }) {
  const { user: currentUser } = useAuth();
  const info = data?.data || data;
  const [currentAuthorPhoto, setCurrentAuthorPhoto] = useState(info?.autorFoto);
  const [showMenu, setShowMenu] = useState(false);

  let day = '--/--';
  let time = '--:--';
  
  if (info?.fecha) {
    const dateObj = info.fecha.toDate ? info.fecha.toDate() : new Date(info.fecha);
    day = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(dateObj);
    time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(dateObj);
  }

  const isAuthor = currentUser?.uid === info?.autorId;
  const isJoined = info?.interesados?.includes(currentUser?.uid);
  const interesadosCount = info?.interesados?.length || 0;

  useEffect(() => {
    if (!info?.autorId) return;
    const fetchCurrentPhoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', info.autorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCurrentAuthorPhoto(userData.fotoPerfil || userData.photoURL || null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentPhoto();
  }, [info?.autorId]);

  const handleAction = async () => {
    if (!currentUser) return;
    if (!isAuthor) {
      if (onJoin) {
        onJoin(info.id, currentUser.uid, isJoined);
      } else {
        try {
          const ref = doc(db, 'partnerTickets', info.id);
          await updateDoc(ref, {
            interesados: isJoined ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
          });
        } catch(e) {
          console.error(e);
        }
      }
    }
  };

  const handleDelete = async () => {
    if(confirm('¿Seguro que quieres borrar tu petición?')) {
      if (onDelete) {
        onDelete(info.id);
      } else {
        try {
          await deleteDoc(doc(db, 'partnerTickets', info.id));
        } catch(e) {
          console.error(e);
        }
      }
      setShowMenu(false);
    }
  };

  return (
    <div className={styles.card} style={{ overflow: 'visible', position: 'relative' }}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Link href={`/perfil?id=${info?.autorId}`} className={styles.userLink} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentAuthorPhoto ? (
              <img src={currentAuthorPhoto} alt={info?.autorNombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={20} color="#64748b" />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.name} style={{ fontWeight: '700', fontSize: '15px' }}>{info?.autorNombre || 'Atleta'}</span>
            <span className={styles.date} style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
              {day} a las {time}
            </span>
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {interesadosCount > 0 && (
            <span className={styles.interesadosBadge} style={{ background: '#dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              {interesadosCount} apuntados
            </span>
          )}

          {isAuthor && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }} 
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <MoreHorizontal size={20} />
              </button>

              {showMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); }}></div>
                  <div style={{ position: 'absolute', right: 0, top: '30px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 999, minWidth: '160px', overflow: 'hidden' }}>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' }}
                    >
                      <Trash2 size={18} /> Eliminar
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: '#f8fafc', border: 'none', borderTop: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' }}
                    >
                      <X size={18} /> Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.infoGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className={styles.infoItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
            <MapPin size={16} color="#94a3b8" />
            <span>{info?.rocodromoNombre || 'Rocódromo'}</span>
          </div>
          <div className={styles.infoItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
            <Activity size={16} color="#94a3b8" />
            <span>{info?.nivel}</span>
          </div>
          <div className={styles.infoItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
            <Hash size={16} color="#94a3b8" />
            <span>{info?.modalidad}</span>
          </div>
          <div className={styles.infoItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
            <Calendar size={16} color="#94a3b8" />
            <span>{info?.franja}</span>
          </div>
        </div>

        {info?.mensaje && (
          <p className={styles.message} style={{ fontStyle: 'italic', color: '#334155', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            "{info.mensaje}"
          </p>
        )}

        {!isAuthor && (
          <div className={styles.actions} style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                background: isJoined ? '#dcfce7' : '#3b82f6',
                color: isJoined ? '#16a34a' : '#ffffff'
              }}
              onClick={handleAction}
            >
              {isJoined ? (
                <><UserCheck size={16} /> Apuntado</>
              ) : (
                <><UserPlus size={16} /> Apuntarme</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}