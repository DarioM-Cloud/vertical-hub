import styles from './text.module.scss';

export default function Text({ children, variant = 'body', className = '' }) {
  return (
    <p className={`${styles.text} ${styles[variant]} ${className}`}>
      {children}
    </p>
  );
}