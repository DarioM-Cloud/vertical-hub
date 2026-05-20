import styles from './tag.module.scss';

export default function Tag({ children, active = false, onClick }) {
  return (
    <button 
      className={`${styles.tag} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}