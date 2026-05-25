import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function useAscensiones() {
  const [submitting, setSubmitting] = useState(false);

  const addAscension = async (userId, data) => {
    if (!userId) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'ascensiones'), {
        userId,
        ...data,
        fecha: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return { addAscension, submitting };
}