import styles from './statBadge.module.scss';

export default function StatBadge({ label, value, highlight = false }) {
  return (
    <div className={`${styles.badge} ${highlight ? styles.highlight : ''}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}