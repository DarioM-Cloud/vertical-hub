'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageSquare, Users, User, Search, Bell } from 'lucide-react';
import Button from '@/components/_base/ui/button';
import Container from '@/components/_base/layout/container';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalCounters } from '@/hooks/useGlobalCounters';
import styles from './navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { unreadTotal, notifCount } = useGlobalCounters(user?.uid);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Comunidad', path: '/comunidad', icon: <Users size={18} /> },
    { name: 'Buscar Gente', path: '/buscador-usuarios', icon: <Search size={18} /> },
    { name: 'Notificaciones', path: '/notificaciones', icon: <Bell size={18} />, badge: notifCount, badgeColor: '#ef4444' },
    { name: 'Mensajería', path: '/mensajes', icon: <MessageSquare size={18} />, badge: unreadTotal, badgeColor: '#3b82f6' }
  ];

  const fotoActual = user?.fotoPerfil || user?.photoURL;

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
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {link.icon}
                  {link.badge > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: link.badgeColor, color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', lineHeight: 1 }}>
                      {link.badge}
                    </span>
                  )}
                </div>
                <span style={{ marginLeft: link.badge > 0 ? '4px' : '0' }}>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <div className={styles.desktopAuth}>
              {!loading && (
                user ? (
                  <Link href="/perfil" className={styles.profileTrigger}>
                    <div className={styles.avatarMini}>
                      {fotoActual ? (
                        <img src={fotoActual} alt={user.displayName || user.nombre || 'Usuario'} />
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {link.icon}
                {link.badge > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: link.badgeColor, color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', lineHeight: 1 }}>
                    {link.badge}
                  </span>
                )}
              </div>
              <span style={{ marginLeft: link.badge > 0 ? '4px' : '0' }}>{link.name}</span>
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
                  {fotoActual ? (
                    <img src={fotoActual} alt={user.displayName || user.nombre || 'Usuario'} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span>Mi Perfil ({user.displayName || user.nombre || 'Usuario'})</span>
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