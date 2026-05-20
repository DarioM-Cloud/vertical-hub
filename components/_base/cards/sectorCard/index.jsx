import styles from './sectorCard.module.scss';

export default function SectorCard({ nombre, tipo, viasCount }) {
  return (
    <div className={styles.card}>
      <span className={styles.tipo}>{tipo}</span>
      <h3 className={styles.nombre}>{nombre}</h3>
      <span className={styles.vias}>{viasCount} vías/bloques</span>
    </div>
  );
}