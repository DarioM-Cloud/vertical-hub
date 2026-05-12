import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useStorage() {
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState(null);

  const subirArchivo = async (archivo, ruta) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, ruta);
      const uploadTask = uploadBytesResumable(storageRef, archivo);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgreso(progress);
        },
        (err) => {
          setError(err);
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setProgreso(0);
          });
        }
      );
    });
  };

  return { subirArchivo, progreso, error };
}