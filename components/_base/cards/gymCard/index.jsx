import Link from 'next/link';
import { MapPin, Users, User } from 'lucide-react';
import styles from './gymCard.module.scss';

export default function GymCard({ data, activeTickets = [] }) {
  const occupancyPercentage = data.aforoMaximo > 0 ? Math.round((data.aforoActual / data.aforoMaximo) * 100) : 0;
  
  let occupancyColor = '#10b981';
  if (occupancyPercentage > 50) occupancyColor = '#f59e0b';
  if (occupancyPercentage > 85) occupancyColor = '#ef4444';

  return (
    <Link href={`/rocodromos/${data.id}`} className={styles.card}>
      <div className={styles.imagePlaceholder}>
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
              <span>Aforo en vivo</span>
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
                <div key={ticket.id} className={styles.avatarBubble} style={{ zIndex: 10 - i }}>
                  {ticket.autorFoto ? (
                    <img src={ticket.autorFoto} alt="Avatar" />
                  ) : (
                    <User size={14} />
                  )}
                </div>
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