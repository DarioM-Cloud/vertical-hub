import styles from './loader.module.scss';

export default function Loader({ text = "Cargando..." }) {
  return <div className={styles.loader}>{text}</div>;
}