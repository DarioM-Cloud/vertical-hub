import GymCard from '@/components/_base/cards/gymCard';
import styles from './home.module.scss';

export default function Home({ rocodromos = [], loading }) {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Tu próxima sesión empieza <span>aquí</span></h1>
          <p>Consulta el radar de ocupación y encuentra compañeros de escalada en segundos.</p>
          <div className={styles.actions}>
            <button className={styles.mainBtn}>Ver Centros Cercanos</button>
            <button className={styles.secBtn}>Buscar Compañero</button>
          </div>
        </div>
      </section>

      <section className={styles.radarSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Radar de Ocupación</h2>
            <span>Actualizado ahora mismo</span>
          </div>

          {loading ? (
            <div className={styles.loading}>Sincronizando con los centros...</div>
          ) : rocodromos.length > 0 ? (
            <div className={styles.grid}>
              {rocodromos.map((roco) => (
                <GymCard key={roco.id} {...roco} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No hay centros disponibles en este momento.</div>
          )}
        </div>
      </section>

      <section className={styles.activity}>
        <div className={styles.container}>
          <h2>Actividad en la Comunidad</h2>
          <div className={styles.activityGrid}>
            <div className={styles.activityCard}>Nuevas betas subidas en <strong>Sputnik</strong></div>
            <div className={styles.activityCard}>3 escaladores buscando partner en <strong>Sharma</strong></div>
            <div className={styles.activityCard}>Evento de bloque este viernes en <strong>Arkose</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}