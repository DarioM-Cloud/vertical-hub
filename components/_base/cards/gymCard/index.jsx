import Link from 'next/link';
import styles from './gymCard.module.scss';

export default function GymCard({ id, nombre, aforoActual, aforoMaximo, ubicacion }) {
  const porcentaje = (aforoActual / aforoMaximo) * 100;
  
  const obtenerEstado = () => {
    if (porcentaje > 80) return styles.lleno;
    if (porcentaje > 50) return styles.medio;
    return styles.tranquilo;
  };

  return (
    <Link href={`/rocodromos/${id}`} className={styles.card}>
      <div className={styles.imageHeader}>
        <div className={styles.badge}>{ubicacion}</div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{nombre}</h3>
        
        <div className={styles.statusContainer}>
          <div className={styles.statusText}>
            <span>Ocupación</span>
            <span className={styles.count}>{aforoActual} / {aforoMaximo}</span>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={`${styles.fill} ${obtenerEstado()}`} 
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}