import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function usePosts() {
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const createPost = async (user, texto, rocodromoId = null, rocodromoNombre = null, file = null) => {
    if (!user) return;
    setSubmitting(true);
    setProgress(0);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (file) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        mediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => reject(error),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      }

      await addDoc(collection(db, 'posts'), {
        autorId: user.uid,
        userName: user.displayName || user.nombre || user.email?.split('@')[0] || 'Atleta',
        userAvatar: user.photoURL || user.fotoPerfil || '',
        texto: texto || '',
        mediaUrl,
        mediaType,
        rocodromoId: rocodromoId || null,
        rocodromoNombre: rocodromoNombre || null,
        fecha: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comentarios: 0,
        comentariosLista: []
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  const deletePost = async (postId) => {
    const confirmacion = window.confirm('¿Seguro que quieres borrar esta publicación?');
    if (!confirmacion) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error(error);
    }
  };

  return { createPost, deletePost, submitting, progress };
}

export function useFeedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { posts, loading };
}