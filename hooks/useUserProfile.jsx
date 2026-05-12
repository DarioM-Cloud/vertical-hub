import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useUserProfile(uid) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(doc(db, 'usuarios', uid), (doc) => {
      setPerfil(doc.exists() ? doc.data() : null);
      setLoading(false);
    });

    return unsub;
  }, [uid]);

  return { perfil, loading };
}