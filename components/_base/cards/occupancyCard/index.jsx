import { Users } from 'lucide-react';
import styles from './occupancyCard.module.scss';

export default function OccupancyCard({ rocodromo }) {
  const occupancyPercentage = rocodromo.aforoMaximo > 0 
    ? Math.round((rocodromo.aforoActual / rocodromo.aforoMaximo) * 100) 
    : 0;
  
  let occupancyColor = '#10b981';
  if (occupancyPercentage > 50) occupancyColor = '#f59e0b';
  if (occupancyPercentage > 85) occupancyColor = '#ef4444';

  return (
    <div className={styles.occupancyCard}>
      <div className={styles.occupancyInfo}>
        <div className={styles.occupancyLabel}>
          <Users size={20} />
          <span>Aforo en tiempo real</span>
        </div>
        <span className={styles.occupancyNumbers} style={{ color: occupancyColor }}>
          {rocodromo.aforoActual} / {rocodromo.aforoMaximo} escaladores
        </span>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${occupancyPercentage}%`, backgroundColor: occupancyColor }}
        ></div>
      </div>
    </div>
  );
}