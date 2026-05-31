'use client';

import { Info, AlertTriangle, Calendar } from 'lucide-react';
import styles from './tablonAvisos.module.scss';

export default function TablonAvisos({ avisos = [] }) {
  if (!avisos || avisos.length === 0) {
    return <div className={styles.empty}>No hay avisos en este momento.</div>;
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    if (fecha.toDate) return fecha.toDate().toLocaleDateString();
    if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleDateString();
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className={styles.list}>
      {avisos.map((aviso) => {
        const tipo = aviso.tipo || 'Informativo';
        
        let Icon = Info;
        let badgeText = 'Información';
        let cardClass = styles.infoCard;

        if (tipo === 'Alerta') {
          Icon = AlertTriangle;
          badgeText = 'Alerta';
          cardClass = styles.alertCard;
        } else if (tipo === 'Evento') {
          Icon = Calendar;
          badgeText = 'Evento';
          cardClass = styles.eventCard;
        }

        return (
          <div key={aviso.id} className={`${styles.card} ${cardClass}`}>
            <div className={styles.iconWrapper}>
              <Icon size={18} />
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.header}>
                <span className={styles.badge}>{badgeText}</span>
                <span className={styles.date}>{formatFecha(aviso.fecha)}</span>
              </div>
              {aviso.titulo && <h4 className={styles.title}>{aviso.titulo}</h4>}
              <p className={styles.text}>{aviso.contenido || aviso.texto}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}