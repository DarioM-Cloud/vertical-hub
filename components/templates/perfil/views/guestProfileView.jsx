'use client';

import Link from 'next/link';
import { Lock, LogIn } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from '../perfil.module.scss';

export default function GuestProfileView() {
  return (
    <Container className={styles.container}>
      <div className={styles.guestCard}>
        <div className={styles.guestIcon}>
          <Lock size={48} />
        </div>
        <h2>Acceso Restringido</h2>
        <p>Debes iniciar sesión en Vertical Hub para explorar los perfiles de la comunidad, comprobar estadísticas y conectar con otros escaladores.</p>
        <div className={styles.guestActions}>
          <Link href="/login" passHref>
            <Button variant="primary" className={styles.guestBtn}>
              <LogIn size={18} />
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button variant="outline" className={styles.guestBtn}>
              Registrarse
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}