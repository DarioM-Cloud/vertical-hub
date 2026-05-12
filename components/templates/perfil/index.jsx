import styles from './perfil.module.scss';

export default function Perfil() {
  return (
    <div className={styles.container}>
      <header className={styles.profileHeader}>
        <div className={styles.avatar}></div>
        <div className={styles.userInfo}>
          <h1>Nombre del Escalador</h1>
          <p className={styles.bio}>Bloquero empedernido. Buscando siempre el próximo proyecto.</p>
        </div>
      </header>

      <section className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>7A</span>
          <span className={styles.statLabel}>Grado Máx.</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>42</span>
          <span className={styles.statLabel}>Encadenes</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>4</span>
          <span className={styles.statLabel}>Rocódromos</span>
        </div>
      </section>

      <main className={styles.logbook}>
        <h2>Mi Logbook</h2>
        <div className={styles.gridVideos}>
          {/* Huecos para los posts/vídeos subidos por este usuario */}
          <div className={styles.videoPlaceholder}>Vídeo Post</div>
          <div className={styles.videoPlaceholder}>Vídeo Post</div>
          <div className={styles.videoPlaceholder}>Vídeo Post</div>
        </div>
      </main>
    </div>
  );
}