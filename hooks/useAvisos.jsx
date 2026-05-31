'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

export function useAvisos(rocoId) {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rocoId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'avisos'), where('rocodromoId', '==', rocoId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a, b) => (b.fecha?.toMillis?.() || 0) - (a.fecha?.toMillis?.() || 0));
      setAvisos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [rocoId]);

  const addAviso = async (anuncioData) => {
    try {
      await addDoc(collection(db, 'avisos'), {
        ...anuncioData,
        rocodromoId: rocoId,
        fecha: serverTimestamp()
      });
    } catch (error) {}
  };

  const deleteAviso = async (avisoId) => {
    try {
      await deleteDoc(doc(db, 'avisos', avisoId));
    } catch (error) {}
  };

  return { avisos, addAviso, deleteAviso, loading };
}