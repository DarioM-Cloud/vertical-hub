'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginTemplate from '@/components/templates/login';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      setError('');
      await login(email, password);
      router.push('/'); 
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return <LoginTemplate onLogin={handleLogin} error={error} />;
}