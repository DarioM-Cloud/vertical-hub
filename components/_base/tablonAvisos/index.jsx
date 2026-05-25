import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import styles from './tablonAvisos.module.scss';

export default function TablonAvisos({ avisos }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <ShieldAlert size={20} className={styles.warningIcon} />
        <h2>Tablón Oficial</h2>
      </div>
      <div className={styles.avisosList}>
        {avisos.length === 0 ? (
          <div className={styles.emptyAvisos}>No hay avisos recientes de la administración.</div>
        ) : (
          avisos.map(aviso => (
            <div key={aviso.id} className={`${styles.avisoCard} ${styles[`aviso_${aviso.tipo || 'info'}`]}`}>
              <div className={styles.avisoIconWrapper}>
                {aviso.tipo === 'alert' || aviso.tipo === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
              </div>
              <div className={styles.avisoContent}>
                <div className={styles.avisoTop}>
                  <span className={styles.avisoBadge}>
                    {aviso.tipo === 'alert' ? 'Importante' : aviso.tipo === 'warning' ? 'Aviso' : 'Información'}
                  </span>
                  <span className={styles.avisoDate}>
                    {aviso.fecha?.toDate ? new Intl.DateTimeFormat('es-ES').format(aviso.fecha.toDate()) : 'Reciente'}
                  </span>
                </div>
                <p>{aviso.mensaje}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}