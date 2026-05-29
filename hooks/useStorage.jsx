import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, folderPath, fileName) => {
    setIsUploading(true);
    setError(null);
    try {
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setIsUploading(false);
      return url;
    } catch (err) {
      setError(err);
      setIsUploading(false);
      throw err;
    }
  };

  return { uploadFile, isUploading, error };
}