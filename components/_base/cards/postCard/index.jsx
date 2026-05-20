import styles from './postCard.module.scss';

export default function PostCard({ usuario, avatar, rocodromo, sector, grado, likes }) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.userMeta}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.info}>
            <span className={styles.name}>{usuario}</span>
            <span className={styles.location}>{rocodromo} • {sector}</span>
          </div>
        </div>
        <div className={styles.gradeBadge}>{grado}</div>
      </header>

      <div className={styles.mediaContainer}>
        <div className={styles.placeholderMedia}></div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.actionBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{likes}</span>
        </button>
      </footer>
    </article>
  );
}