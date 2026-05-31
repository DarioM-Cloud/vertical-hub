'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import LoginTemplate from '@/components/templates/login';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      setError('');
      await login(email, password);
      
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().bloqueado) {
          await signOut(auth);
          setError('Su usuario ha sido bloqueado.');
          return;
        }
      }

      router.push('/'); 
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return <LoginTemplate onLogin={handleLogin} error={error} />;
}