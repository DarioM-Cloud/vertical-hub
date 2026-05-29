'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageSquare, Users, User } from 'lucide-react';
import Button from '@/components/_base/ui/button';
import Container from '@/components/_base/layout/container';
import { useAuth } from '@/hooks/useAuth';
import styles from './navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Comunidad', path: '/comunidad', icon: <Users size={18} /> },
    { name: 'Mensajería', path: '/mensajes', icon: <MessageSquare size={18} /> }
  ];

  return (
    <>
      <nav className={styles.navbar}>
        <Container className={styles.navContainer}>
          <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
            Vertical<span>Hub</span>
          </Link>

          <div className={styles.desktopLinks}>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <div className={styles.desktopAuth}>
              {!loading && (
                user ? (
                  <Link href="/perfil" className={styles.profileTrigger}>
                    <div className={styles.avatarMini}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'Usuario'} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="primary">Iniciar Sesión</Button>
                  </Link>
                )
              )}
            </div>

            <button className={styles.menuBtn} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>
      </nav>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className={styles.mobileAuthDivider}></div>

        <div className={styles.mobileAuth}>
          {!loading && (
            user ? (
              <Link 
                href="/perfil"
                className={styles.mobileProfileBtn}
                onClick={closeMobileMenu}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.avatarMini}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'Usuario'} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span>Mi Perfil ({user.displayName || 'Usuario'})</span>
              </Link>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none', width: '100%' }} onClick={closeMobileMenu}>
                <Button variant="primary" style={{ width: '100%' }}>Iniciar Sesión</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
}