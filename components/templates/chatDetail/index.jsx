'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, User, Lock } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import styles from './chatDetail.module.scss';

export default function ChatDetailTemplate({ mensajes = [], currentUserId, otroUsuarioId, otherUserName, onSendMessage }) {
  const router = useRouter();
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const mensajesEndRef = useRef(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    onSendMessage(nuevoMensaje);
    setNuevoMensaje('');
  };

  return (
    <Container className={styles.container}>
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <button className={styles.backBtn} onClick={() => router.push('/mensajes')}>
            <ArrowLeft size={20} />
          </button>
          <Link href={`/perfil?id=${otroUsuarioId}`} className={styles.headerUser} style={{ textDecoration: 'none' }}>
            <div className={styles.avatarPlaceholder}>
              <User size={20} />
            </div>
            <span className={styles.headerName}>{otherUserName || 'Atleta'}</span>
          </Link>
        </div>

        <div className={styles.messagesContainer}>
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
          <div ref={mensajesEndRef} />
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
  );
}