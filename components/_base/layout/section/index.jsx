import styles from './section.module.scss';

export default function Section({ children, className = '' }) {
  return (
    <section className={`${styles.section} ${className}`}>
      {children}
    </section>
  );
}