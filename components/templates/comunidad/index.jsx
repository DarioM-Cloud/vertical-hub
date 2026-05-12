import styles from './comunidad.module.scss';

export default function Comunidad() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Últimos Encadenes</h1>
        <button className={styles.btnPrimary}>+ Subir Beta</button>
      </header>

      {/* Aquí irán los filtros por Rocódromo o Sector en el futuro */}
      <section className={styles.filters}>
        <button className={styles.filterTag}>Todos</button>
        <button className={styles.filterTag}>Bloque</button>
        <button className={styles.filterTag}>Vía</button>
      </section>

      <main className={styles.feed}>
        {/* Aquí iteraremos sobre los posts. Por ahora ponemos "huecos" */}
        <div className={styles.postPlaceholder}>
          <p>Hueco para el Componente PostCard (Video/Foto)</p>
        </div>
        <div className={styles.postPlaceholder}>
          <p>Hueco para el Componente PostCard (Video/Foto)</p>
        </div>
      </main>
    </div>
  );
}