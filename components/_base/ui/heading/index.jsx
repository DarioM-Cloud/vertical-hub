import styles from './heading.module.scss';

export default function Heading({ level = 1, children, className = '' }) {
  const Tag = `h${level}`;
  return (
    <Tag className={`${styles.heading} ${styles[`h${level}`]} ${className}`}>
      {children}
    </Tag>
  );
}