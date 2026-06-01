'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Input from '@/components/_base/ui/input';
import Button from '@/components/_base/ui/button';
import styles from './recuperarPassword.module.scss';

export default function RecuperarPasswordTemplate() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage('Se ha enviado un enlace de recuperación a tu correo.');
    } catch (err) {
      setError('Error al enviar el correo. Verifica que la dirección sea correcta.');
    }

    setLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <Section className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.headerText}>
              <Heading level={1}>Recuperar Contraseña</Heading>
              <Text className={styles.subtitle}>
                Introduce tu correo y te enviaremos las instrucciones.
              </Text>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.success}>{message}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>

            <div className={styles.divider}></div>

            <Text className={styles.footerText}>
              ¿Recordaste tu contraseña? <Link href="/login">Inicia sesión</Link>
            </Text>
          </div>
        </Section>
      </Container>
    </div>
  );
}