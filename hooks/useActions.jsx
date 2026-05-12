import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useActions() {
  const crearPost = async (userId, rocodromoId, sectorId, videoUrl, caption) => {
    await addDoc(collection(db, 'posts'), {
      userId,
      rocodromoId,
      sectorId,
      videoUrl,
      caption,
      createdAt: serverTimestamp(),
      likes: []
    });
  };

  const publicarAnuncio = async (userId, rocodromoId, mensaje, nivel, fechaSesion) => {
    await addDoc(collection(db, 'partner_check'), {
      userId,
      rocodromoId,
      mensaje,
      nivel,
      fechaSesion,
      createdAt: serverTimestamp()
    });
  };

  return { crearPost, publicarAnuncio };
}