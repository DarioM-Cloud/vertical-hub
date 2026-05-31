import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  where,
  increment
} from 'firebase/firestore';

export function useChat(currentUserUid, targetUserUid) {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (!currentUserUid || !targetUserUid) return;

    const setupChat = async () => {
      const ids = [currentUserUid, targetUserUid].sort();
      const newChatId = `${ids[0]}_${ids[1]}`;
      setChatId(newChatId);

      const chatRef = doc(db, 'chats', newChatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participantes: ids,
          ultimoMensaje: '',
          fechaActualizacion: serverTimestamp(),
          noLeidos: {
            [currentUserUid]: 0,
            [targetUserUid]: 0
          }
        });
      }

      const userRef = doc(db, 'usuarios', targetUserUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setOtherUser(userSnap.data());
      }
    };

    setupChat();
  }, [currentUserUid, targetUserUid]);

  useEffect(() => {
    if (!chatId) return;

    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);

    const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
    const q = query(
      mensajesRef,
      where('fecha', '>=', dosDiasAtras),
      orderBy('fecha', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMensajes(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUserUid) return;
    const marcarComoLeido = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          [`noLeidos.${currentUserUid}`]: 0
        });
      } catch (error) {}
    };
    marcarComoLeido();
  }, [chatId, currentUserUid, mensajes]);

  const enviarMensaje = async (texto) => {
    if (!texto.trim() || !chatId) return;

    const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
    const chatRef = doc(db, 'chats', chatId);

    await addDoc(mensajesRef, {
      remitenteId: currentUserUid,
      texto: texto,
      fecha: serverTimestamp(),
      leido: false
    });

    await updateDoc(chatRef, {
      ultimoMensaje: texto,
      fechaActualizacion: serverTimestamp(),
      [`noLeidos.${targetUserUid}`]: increment(1)
    });
  };

  return { mensajes, loading, otherUser, enviarMensaje };
}