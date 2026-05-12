import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useSectores(rocodromoId) {
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rocodromoId) return;

    const q = query(
      collection(db, 'sectores'),
      where('rocodromoId', '==', rocodromoId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
      setSectores(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [rocodromoId]);

  return { sectores, loading };
}