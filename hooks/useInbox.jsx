import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';

export function useInbox(currentUserUid) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserUid) return;

    const q = query(
      collection(db, 'chats'),
      where('participantes', 'array-contains', currentUserUid),
      orderBy('fechaActualizacion', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const data = chatDoc.data();
        const interlocutorUid = data.participantes.find(id => id !== currentUserUid);
        
        let nombreInterlocutor = 'Usuario';
        if (interlocutorUid) {
          const userRef = doc(db, 'usuarios', interlocutorUid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            nombreInterlocutor = userSnap.data().nombre || userSnap.data().displayName || 'Usuario';
          }
        }

        return {
          id: chatDoc.id,
          ...data,
          nombreInterlocutor,
          interlocutorUid
        };
      });

      const resolvedChats = await Promise.all(chatPromises);
      setChats(resolvedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserUid]);

  return { chats, loading };
}