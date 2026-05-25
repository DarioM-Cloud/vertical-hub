import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export function useRocodromos() {
  const [rocodromos, setRocodromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rocodromos'), orderBy('nombre'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRocodromos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { rocodromos, loading };
}