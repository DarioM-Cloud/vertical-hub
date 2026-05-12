import styles from './rocodromo.module.scss';

export default function Rocodromo({ nombreRocodromo }) {
  return (
    <div className={styles.container}>
      <div className={styles.heroBanner}>
        {/* Aquí irá la imagen de portada */}
      </div>

      <div className={styles.content}>
        <header className={styles.headerInfo}>
          <h1>{nombreRocodromo || "Nombre del Rocódromo"}</h1>
          <p className={styles.location}>Ubicación y Horarios</p>
          <div className={styles.aforoBadge}>Aforo: 45 / 100</div>
        </header>

        <section className={styles.sectoresSection}>
          <h2>Sectores Disponibles</h2>
          <div className={styles.sectoresGrid}>
            {/* Huecos para los sectores */}
            <div className={styles.sectorCard}>Muro de Competición</div>
            <div className={styles.sectorCard}>La Cueva (Desplome)</div>
            <div className={styles.sectorCard}>Placa Técnica</div>
          </div>
        </section>
      </div>
    </div>
  );
}