import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function usePosts() {
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const createPost = async (rocodromoId, userId, userName, userAvatar, text, file) => {
    setSubmitting(true);
    setProgress(0);
    
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (file) {
        /* He decidido usar el timestamp y el nombre original para evitar que mis archivos colisionen en el Storage */
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        mediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(p);
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      }

      await addDoc(collection(db, 'posts'), {
        rocodromoId,
        userId,
        userName,
        userAvatar: userAvatar || '',
        texto: text,
        mediaUrl,
        mediaType,
        fecha: serverTimestamp(),
        likes: 0,
        comentarios: 0
      });

    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  return { createPost, submitting, progress };
}