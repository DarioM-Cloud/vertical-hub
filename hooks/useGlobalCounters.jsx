'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useGlobalCounters(userId) {
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unreadPerChat, setUnreadPerChat] = useState({});
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const qChats = query(collection(db, 'chats'), where('participantes', 'array-contains', userId));
    const unsubChats = onSnapshot(qChats, (snap) => {
      let total = 0;
      const perChat = {};
      
      snap.docs.forEach(doc => {
        const data = doc.data();
        const unread = data.noLeidos?.[userId] || 0;
        if (unread > 0) {
          total += unread;
          perChat[doc.id] = unread;
        }
      });
      
      setUnreadTotal(total);
      setUnreadPerChat(perChat);
    });

    const qNotifs = query(
      collection(db, 'notificaciones'), 
      where('receptorId', '==', userId),
      where('leida', '==', false)
    );
    
    const unsubNotifs = onSnapshot(qNotifs, (snap) => {
      setNotifCount(snap.docs.length);
    });

    return () => {
      unsubChats();
      unsubNotifs();
    };
  }, [userId]);

  return { unreadTotal, unreadPerChat, notifCount };
}