import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';

export function usePartnerCheck() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'partnerTickets'), orderBy('fecha', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const tenHoursInMs = 10 * 60 * 60 * 1000;

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(ticket => {
          if (!ticket.fecha) return true;
          const ticketTime = ticket.fecha.toDate().getTime();
          return (now - ticketTime) <= tenHoursInMs;
        });

      setTickets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTicket = async (user, rocodromoId, rocodromoNombre, nivel, franja, modalidad, mensaje) => {
    if (!user || !rocodromoId) return;
    await addDoc(collection(db, 'partnerTickets'), {
      autorId: user.uid,
      autorNombre: user.displayName || user.nombre || 'Atleta',
      autorFoto: user.photoURL || user.fotoPerfil || '',
      rocodromoId,
      rocodromoNombre,
      nivel,
      franja,
      modalidad,
      mensaje,
      interesados: [],
      fecha: serverTimestamp()
    });
  };

  const deleteTicket = async (ticketId) => {
    if (!ticketId) return;
    await deleteDoc(doc(db, 'partnerTickets', ticketId));
  };

  const toggleJoin = async (ticketId, userId, isJoined) => {
    if (!ticketId || !userId) return;
    const ref = doc(db, 'partnerTickets', ticketId);
    await updateDoc(ref, {
      interesados: isJoined ? arrayRemove(userId) : arrayUnion(userId)
    });
  };

  return { tickets, loading, addTicket, deleteTicket, toggleJoin };
}