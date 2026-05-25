import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, or, where, and, getDocs, limit, doc, getDoc } from 'firebase/firestore';

export function useInbox(uid) {
  const [chats, setChats] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'amistades'),
      and(
        or(
          where('remitenteId', '==', uid),
          where('receptorId', '==', uid)
        ),
        where('estado', '==', 'aceptados')
      )
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const chatsList = [];
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const friendId = data.remitenteId === uid ? data.receptorId : data.remitenteId;
          const userRef = doc(db, 'usuarios', friendId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            chatsList.push({
              chatId: data.id,
              friendId: friendId,
              ...userSnap.data()
            });
          }
        }
        setChats(chatsList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    const fetchRandom = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, 'usuarios'), limit(20)));
        const allUsers = usersSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.id !== uid);
        
        const shuffled = allUsers.sort(() => 0.5 - Math.random());
        setRandomUsers(shuffled.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandom();

    return () => unsubscribe();
  }, [uid]);

  return { chats, randomUsers, loading };
}