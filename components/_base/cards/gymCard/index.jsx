'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Users, User } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './gymCard.module.scss';

function TicketAvatar({ ticket, index, router }) {
  const [foto, setFoto] = useState(ticket.autorFoto);

  useEffect(() => {
    if (!ticket.autorId) return;
    const fetchPhoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', ticket.autorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFoto(data.fotoPerfil || data.photoURL || ticket.autorFoto);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhoto();
  }, [ticket.autorId, ticket.autorFoto]);

  return (
    <div 
      className={styles.avatarBubble} 
      style={{ zIndex: 10 - index, cursor: 'pointer' }}
      onClick={(e) => {
        e.preventDefault();
        router.push(`/perfil?id=${ticket.autorId}`);
      }}
    >
      {foto ? (
        <img src={foto} alt="Avatar" />
      ) : (
        <User size={14} />
      )}
    </div>
  );
}

export default function GymCard({ data, activeTickets = [] }) {
  const router = useRouter();
  const occupancyPercentage = data.aforoMaximo > 0 ? Math.round((data.aforoActual / data.aforoMaximo) * 100) : 0;
  
  let occupancyColor = '#10b981';
  if (occupancyPercentage > 50) occupancyColor = '#f59e0b';
  if (occupancyPercentage > 85) occupancyColor = '#ef4444';

  const backgroundImageUrl = data.imagenUrl || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <Link href={`/rocodromos/${data.id}`} className={styles.card}>
      <div 
        className={styles.imagePlaceholder}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className={styles.gradient}></div>
        <h3 className={styles.name}>{data.nombre}</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.location}>
          <MapPin size={16} />
          <span>{data.ubicacion}</span>
        </div>
        
        <div className={styles.occupancySection}>
          <div className={styles.occupancyHeader}>
            <div className={styles.occupancyLabel}>
              <Users size={16} />
              <span>Aforo en tiempo real:</span>
            </div>
            <span className={styles.occupancyText} style={{ color: occupancyColor }}>
              {data.aforoActual} / {data.aforoMaximo}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${occupancyPercentage}%`, backgroundColor: occupancyColor }}
            ></div>
          </div>
        </div>

        <div className={styles.details}>
          <span className={styles.detailTag}>{data.numSectores || 0} Sectores</span>
          {data.tieneVias && <span className={styles.detailTag}>Vías de Cuerda</span>}
        </div>

        <div className={styles.partnerSection}>
          <span className={styles.partnerLabel}>Buscando compañero:</span>
          {activeTickets.length > 0 ? (
            <div className={styles.avatarGroup}>
              {activeTickets.slice(0, 4).map((ticket, i) => (
                <TicketAvatar key={ticket.id} ticket={ticket} index={i} router={router} />
              ))}
              {activeTickets.length > 4 && (
                <div className={styles.avatarBubbleMore} style={{ zIndex: 0 }}>
                  +{activeTickets.length - 4}
                </div>
              )}
            </div>
          ) : (
            <span className={styles.noPartners}>Sin peticiones</span>
          )}
        </div>
      </div>
    </Link>
  );
}