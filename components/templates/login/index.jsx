'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Input from '@/components/_base/ui/input';
import Button from '@/components/_base/ui/button';
import styles from './login.module.scss';

export default function LoginTemplate({ onLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <Container className={styles.container}>
      <Section className={styles.formSection}>
        <div className={styles.card}>
          <div className={styles.headerText}>
            <Heading level={1}>Bienvenido de nuevo</Heading>
            <Text className={styles.subtitle}>
              Inicia sesión para compartir betas y encontrar compañeros.
            </Text>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Correo Electrónico</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link href="/recuperar-password" className={styles.forgotPassword}>
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            <Button type="submit" variant="primary" className={styles.submitBtn}>
              Iniciar Sesión
            </Button>
          </form>

          <div className={styles.divider}></div>

          <Text className={styles.footerText}>
            ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
          </Text>
        </div>
      </Section>
    </Container>
  );
}