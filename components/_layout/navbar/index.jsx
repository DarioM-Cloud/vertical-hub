import Link from 'next/link';
import { ROUTES, NAV_LINKS } from '@/lib/routes.config';
import styles from './navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href={ROUTES.HOME.path} className={styles.logo}>
          VERTICAL<span>HUB</span>
        </Link>
        
        <div className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link key={link.path} href={link.path}>
              {link.label}
            </Link>
          ))}
          <Link href={ROUTES.PERFIL.path} className={styles.profileLink}>
            {ROUTES.PERFIL.label}
          </Link>
        </div>
      </div>
    </nav>
  );
}