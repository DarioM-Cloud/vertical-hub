'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, User, Lock } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './chatDetail.module.scss';

export default function ChatDetailTemplate({ mensajes = [], currentUserId, otroUsuarioId, otherUserName, onSendMessage }) {
  const router = useRouter();
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [otherUserPhoto, setOtherUserPhoto] = useState(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    if (!otroUsuarioId) return;
    const fetchPhoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', otroUsuarioId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setOtherUserPhoto(data.fotoPerfil || data.photoURL || null);
        }
      } catch (error) {}
    };
    fetchPhoto();
  }, [otroUsuarioId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    onSendMessage(nuevoMensaje);
    setNuevoMensaje('');
  };

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <button className={styles.backBtn} onClick={() => router.push('/mensajes')}>
              <ArrowLeft size={20} />
            </button>
            <Link href={`/perfil?id=${otroUsuarioId}`} className={styles.headerUser} style={{ textDecoration: 'none' }}>
              <div className={styles.avatarPlaceholder}>
                {otherUserPhoto ? (
                  <img src={otherUserPhoto} alt={otherUserName} />
                ) : (
                  <User size={20} color="#64748b" />
                )}
              </div>
              <span className={styles.headerName}>{otherUserName || 'Atleta'}</span>
            </Link>
          </div>

          <div className={styles.messagesContainer} ref={messagesContainerRef}>
            <div className={styles.encryptionNotice}>
              <Lock size={12} />
              <span>Tus mensajes están cifrados de extremo a extremo.</span>
            </div>

            {mensajes.length === 0 ? (
              <div className={styles.emptyMessages}>Aún no hay mensajes. ¡Rompe el hielo!</div>
            ) : (
              mensajes.map(msg => {
                const esPropio = msg.remitenteId === currentUserId || msg.senderId === currentUserId;
                return (
                  <div 
                    key={msg.id} 
                    className={`${styles.messageWrapper} ${esPropio ? styles.messageOwn : styles.messageOther}`}
                  >
                    <div className={styles.messageBubble}>
                      <p>{msg.texto}</p>
                      <span className={styles.messageTime}>
                        {msg.fecha?.toDate ? 
                          new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(msg.fecha.toDate()) 
                          : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form className={styles.inputForm} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button type="submit" disabled={!nuevoMensaje.trim()} className={styles.sendBtn}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}