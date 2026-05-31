'use client';

import { db } from '@/lib/firebase';
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp } from 'firebase/firestore';

export function useRocoAdminActions(rocoId) {
  const updateOccupancy = async (newCount) => {
    if (!rocoId) return;
    try {
      await updateDoc(doc(db, 'rocodromos', rocoId), { ocupacionActual: newCount });
    } catch (error) {}
  };

  const addAnnouncement = async (data) => {
    if (!rocoId) return;
    try {
      await addDoc(collection(db, 'avisos'), {
        ...data,
        rocodromoId: rocoId,
        fecha: serverTimestamp()
      });
    } catch (error) {}
  };

  const deleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, 'avisos', id));
    } catch (error) {}
  };

  const updateRoute = async (id, data) => {
    try {
      await updateDoc(doc(db, 'vias', id), data);
    } catch (error) {}
  };

  const removePostFromGym = async (id) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        rocodromoId: null,
        rocodromoNombre: null
      });
    } catch (error) {}
  };

  return {
    updateOccupancy,
    addAnnouncement,
    deleteAnnouncement,
    updateRoute,
    removePostFromGym
  };
}