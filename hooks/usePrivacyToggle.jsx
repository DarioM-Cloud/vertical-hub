import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export function usePrivacyToggle(uid) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'usuarios', uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsPrivate(!!docSnap.data().esPrivado);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const togglePrivacy = async () => {
    if (!uid) return;
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, {
      esPrivado: !isPrivate
    });
  };

  return { isPrivate, loading, togglePrivacy };
}