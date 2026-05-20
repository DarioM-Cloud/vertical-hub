import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRocodromoDetail(id) {
  const [rocodromo, setRocodromo] = useState(null);
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const rocoRef = doc(db, 'rocodromos', id);
        const rocoSnap = await getDoc(rocoRef);

        if (rocoSnap.exists()) {
          setRocodromo({ id: rocoSnap.id, ...rocoSnap.data() });
        }

        const sectoresRef = collection(db, 'sectores');
        const q = query(sectoresRef, where('rocodromoId', '==', id));
        const sectoresSnap = await getDocs(q);
        
        const sectoresData = [];
        sectoresSnap.forEach((doc) => {
          sectoresData.push({ id: doc.id, ...doc.data() });
        });
        
        setSectores(sectoresData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { rocodromo, sectores, loading };
}