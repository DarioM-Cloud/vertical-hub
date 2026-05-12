import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function usePartnerCheck(rocodromoId = null) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q;
    
    if (rocodromoId) {
      q = query(
        collection(db, 'partner_check'),
        where('rocodromoId', '==', rocodromoId),
        orderBy('fecha', 'desc')
      );
    } else {
      q = query(
        collection(db, 'partner_check'),
        orderBy('fecha', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
      setSolicitudes(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [rocodromoId]);

  return { solicitudes, loading };
}