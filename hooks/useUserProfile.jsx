import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, orderBy, updateDoc } from 'firebase/firestore';

export function useUserProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [logbook, setLogbook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLogbook([]);
      setLoading(false);
      return;
    }

    const unsubscribeProfile = onSnapshot(doc(db, 'usuarios', uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProfile(null);
      }
    });

    const q = query(
      collection(db, 'ascensiones'),
      where('userId', '==', uid),
      orderBy('fecha', 'desc')
    );

    const unsubscribeLogbook = onSnapshot(q, (snapshot) => {
      const ascensiones = snapshot.docs.map(doc => {
        const data = doc.data();
        const fechaFormat = data.fecha?.toDate 
          ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(data.fecha.toDate())
          : 'Reciente';
          
        return {
          id: doc.id,
          ...data,
          fechaFormateada: fechaFormat
        };
      });
      setLogbook(ascensiones);
      setLoading(false);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeLogbook();
    };
  }, [uid]);

  const updateProfile = async (data) => {
    if (!uid) return;
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, data);
  };

  return { profile, logbook, loading, updateProfile };
}