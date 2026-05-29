import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs, limit, doc, getDoc, orderBy } from 'firebase/firestore';

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
      collection(db, 'chats'),
      where('participantes', 'array-contains', uid),
      orderBy('fechaActualizacion', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const chatsList = [];
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          
          if (!data.ultimoMensaje) continue;

          const friendId = data.participantes.find(id => id !== uid);
          if (!friendId) continue;

          const userRef = doc(db, 'usuarios', friendId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            chatsList.push({
              chatId: docSnap.id,
              otherUserId: friendId,
              ultimoMensaje: data.ultimoMensaje,
              fechaActualizacion: data.fechaActualizacion,
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

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const fetchRandom = async () => {
      try {
        const activeChatIds = chats.map(c => c.otherUserId);
        const usersSnap = await getDocs(query(collection(db, 'usuarios'), limit(30)));
        
        const allUsers = usersSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.id !== uid && !activeChatIds.includes(u.id));
        
        const shuffled = allUsers.sort(() => 0.5 - Math.random());
        setRandomUsers(shuffled.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandom();
  }, [uid, chats]);

  return { chats, randomUsers, loading };
}