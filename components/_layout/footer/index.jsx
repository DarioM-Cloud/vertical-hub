import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h2 className={styles.logo}>VERTICAL<span>HUB</span></h2>
          <p>La plataforma definitiva para la comunidad de escalada indoor.</p>
        </div>
        
        <div className={styles.group}>
          <h3>Explorar</h3>
          <ul>
            <li>Radar de centros</li>
            <li>Partner Check</li>
            <li>Comunidad</li>
          </ul>
        </div>

        <div className={styles.group}>
          <h3>Soporte</h3>
          <ul>
            <li>Contacto</li>
            <li>Privacidad</li>
            <li>Términos</li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2026 Vertical Hub. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}