import { Users } from 'lucide-react';
import styles from './occupancyCard.module.scss';

export default function OccupancyCard({ rocodromo }) {
  if (!rocodromo) return null;

  const aforoActual = rocodromo.aforoActual || 0;
  const aforoMaximo = rocodromo.aforoMaximo || 100;
  const porcentaje = Math.min(100, Math.max(0, (aforoActual / aforoMaximo) * 100));

  let statusClass = styles.low;
  let statusText = 'Baja';

  if (porcentaje >= 90) {
    statusClass = styles.critical;
    statusText = 'Lleno';
  } else if (porcentaje >= 75) {
    statusClass = styles.high;
    statusText = 'Alta';
  } else if (porcentaje >= 40) {
    statusClass = styles.medium;
    statusText = 'Media';
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Users size={18} />
          <h3>Aforo en tiempo real</h3>
        </div>
        <span className={`${styles.statusBadge} ${statusClass}`}>{statusText}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.numbers}>
          <span className={styles.current}>{aforoActual}</span>
          <span className={styles.divider}>/</span>
          <span className={styles.max}>{aforoMaximo}</span>
        </div>
        
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBarBg}>
            <div 
              className={`${styles.progressBarFill} ${statusClass}`}
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>

        <p className={styles.updateText}>Sincronizado automáticamente</p>
      </div>
    </div>
  );
}