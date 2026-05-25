'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, MessageSquare, User } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import SettingsDrawer from '@/components/_base/ui/drawer';
import { useAuth } from '@/context/AuthContext';
import styles from './navbar.module.scss';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <nav className={styles.navbar}>
        <Container className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            Vertical Hub
          </Link>

          <div className={styles.links}>
            <Link href="/comunidad" className={styles.navLink}>
              Comunidad
            </Link>
            {user && (
              <>
                <Link href="/mensajes" className={styles.navLink}>
                  <MessageSquare size={20} />
                </Link>
                <Link href="/perfil" className={styles.navLink}>
                  <User size={20} />
                </Link>
              </>
            )}
          </div>

          <div className={styles.actions}>
            {user ? (
              <Button variant="ghost" className={styles.menuBtn} onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} />
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="primary">Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </Container>
      </nav>

      {user && (
        <SettingsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}