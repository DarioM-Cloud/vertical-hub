import styles from './rocodromos.module.scss';

export default function Rocodromos() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Explorar Rocódromos</h1>
        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Buscar por nombre o ciudad..." 
            className={styles.searchInput}
          />
        </div>
      </header>

      <section className={styles.filters}>
        <button className={styles.filterBtn}>Cerca de mí</button>
        <button className={styles.filterBtn}>Solo Boulder</button>
        <button className={styles.filterBtn}>Con Vías</button>
      </section>

      <main className={styles.grid}>
        {/* Huecos para los rocódromos */}
        <div className={styles.gymPlaceholder}>Hueco para GymCard</div>
        <div className={styles.gymPlaceholder}>Hueco para GymCard</div>
        <div className={styles.gymPlaceholder}>Hueco para GymCard</div>
      </main>
    </div>
  );
}