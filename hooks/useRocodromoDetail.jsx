'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';

export function useRocodromoDetail(rocoId) {
  const [rocodromo, setRocodromo] = useState(null);
  const [vias, setVias] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rocoId) {
      setLoading(false);
      return;
    }

    const rocoRef = doc(db, 'rocodromos', rocoId);
    const unsubRoco = onSnapshot(rocoRef, (docSnap) => {
      if (docSnap.exists()) {
        setRocodromo({ id: docSnap.id, ...docSnap.data() });
      }
    });

    const viasQuery = query(collection(db, 'vias'), where('rocodromoId', '==', rocoId));
    const unsubVias = onSnapshot(viasQuery, (snapshot) => {
      setVias(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const avisosQuery = query(collection(db, 'avisos'), where('rocodromoId', '==', rocoId));
    const unsubAvisos = onSnapshot(avisosQuery, (snapshot) => {
      const fetchedAvisos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedAvisos.sort((a, b) => {
        const timeA = a.fecha?.toMillis ? a.fecha.toMillis() : Date.now();
        const timeB = b.fecha?.toMillis ? b.fecha.toMillis() : Date.now();
        return timeB - timeA;
      });
      setAvisos(fetchedAvisos);
    });

    const postsQuery = query(collection(db, 'posts'), where('rocodromoId', '==', rocoId));
    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedPosts.sort((a, b) => {
        const timeA = a.fecha?.toMillis ? a.fecha.toMillis() : Date.now();
        const timeB = b.fecha?.toMillis ? b.fecha.toMillis() : Date.now();
        return timeB - timeA;
      });
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => {
      unsubRoco();
      unsubVias();
      unsubAvisos();
      unsubPosts();
    };
  }, [rocoId]);

  return { rocodromo, vias, avisos, posts, loading };
}