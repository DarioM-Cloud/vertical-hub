import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function useRocodromoDetail(id) {
  const [rocodromo, setRocodromo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [vias, setVias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRoco = async () => {
      try {
        const docRef = doc(db, 'rocodromos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRocodromo({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoco();

    const qPosts = query(
      collection(db, 'posts'),
      where('rocodromoId', '==', id),
      orderBy('fecha', 'desc')
    );

    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qAvisos = query(
      collection(db, 'avisos'),
      where('rocodromoId', '==', id),
      orderBy('fecha', 'desc')
    );

    const unsubAvisos = onSnapshot(qAvisos, (snapshot) => {
      setAvisos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qVias = query(
      collection(db, 'vias'),
      where('rocodromoId', '==', id)
    );

    const unsubVias = onSnapshot(qVias, (snapshot) => {
      setVias(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubPosts();
      unsubAvisos();
      unsubVias();
    };
  }, [id]);

  return { rocodromo, posts, avisos, vias, loading };
}