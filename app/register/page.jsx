'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RegisterTemplate from '@/components/templates/register';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (email, password, confirmPassword, nombre) => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setError('');
      await register(email, password, nombre);
      router.push('/perfil');
    } catch (err) {
      setError('Error al crear la cuenta. El correo podría estar en uso.');
    }
  };

  return <RegisterTemplate onRegister={handleRegister} error={error} />;
}