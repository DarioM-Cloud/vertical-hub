import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

export function useComunidadPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addPost = async (user, texto) => {
    if (!user || !texto.trim()) return;
    await addDoc(collection(db, 'posts'), {
      autorId: user.uid,
      autorNombre: user.displayName || user.nombre || 'Atleta',
      autorFoto: user.photoURL || user.fotoPerfil || '',
      texto: texto,
      fecha: serverTimestamp()
    });
  };

  return { posts, loading, addPost };
}