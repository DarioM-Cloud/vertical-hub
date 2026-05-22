import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export function useFriendship(currentUserUid, targetUserUid, isTargetPrivate) {
  const [relation, setRelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserUid || !targetUserUid) {
      setLoading(false);
      return;
    }

    const idCombo = [currentUserUid, targetUserUid].sort().join('_');
    const docRef = doc(db, 'amistades', idCombo);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setRelation(docSnap.data());
      } else {
        setRelation(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserUid, targetUserUid]);

  const handleAction = async () => {
    if (!currentUserUid || !targetUserUid) return;
    
    const idCombo = [currentUserUid, targetUserUid].sort().join('_');
    const docRef = doc(db, 'amistades', idCombo);

    if (!relation) {
      if (isTargetPrivate) {
        await setDoc(docRef, {
          id: idCombo,
          remitenteId: currentUserUid,
          receptorId: targetUserUid,
          estado: 'pendiente',
          fechaActualizacion: serverTimestamp()
        });
      } else {
        await setDoc(docRef, {
          id: idCombo,
          remitenteId: currentUserUid,
          receptorId: targetUserUid,
          estado: 'aceptados',
          fechaActualizacion: serverTimestamp()
        });
      }
    } else if (relation.estado === 'pendiente' || relation.estado === 'aceptados') {
      await deleteDoc(docRef);
    }
  };

  return { relation, loading, handleAction };
}