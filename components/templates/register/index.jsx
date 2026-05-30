'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Input from '@/components/_base/ui/input';
import Button from '@/components/_base/ui/button';
import styles from './register.module.scss';

export default function RegisterTemplate({ onRegister, error }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password, confirmPassword, nombre);
  };

  return (
    <div className={styles.pageWrapper}>
    <Container className={styles.container}>
      <Section className={styles.formSection}>
        <div className={styles.card}>
          <Heading level={1}>Crear Cuenta</Heading>
          <Text variant="muted" className={styles.subtitle}>
            Regístrate para conectar con otros escaladores y seguir progresando.
          </Text>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Nombre de usuario</label>
              <Input
                type="text"
                placeholder="Tu nombre o nick"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

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
            </div>

            <div className={styles.inputGroup}>
              <label>Confirmar Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className={styles.submitBtn}>
              Registrarme
            </Button>
          </form>

          <Text className={styles.footerText}>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
          </Text>
        </div>
      </Section>
    </Container>
    </div>
  );
}