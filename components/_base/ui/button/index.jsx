import styles from './button.module.scss';

export default function Button({ children, variant = 'primary', onClick, className = '' }) {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}