'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { ROUTES, NAV_LINKS } from '@/lib/routes.config';
import { useAuth } from '@/context/AuthContext';
import SettingsDrawer from '@/components/_base/ui/drawer';
import styles from './navbar.module.scss';

export default function Navbar() {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href={ROUTES.HOME.path} className={styles.logo}>
            VERTICAL<span>HUB</span>
          </Link>
          
          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link key={link.path} href={link.path} className={styles.navLink}>
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className={styles.userActions}>
                <Link href={ROUTES.PERFIL.path} className={styles.profileLink}>
                  Mi Perfil
                </Link>
                <button 
                  className={styles.settingsBtn} 
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Configuración"
                >
                  <Settings size={22} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      <SettingsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
}