'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, User, MessageSquare, ExternalLink, MessageCircle } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './mensajes.module.scss';

export default function MensajesTemplate({ chats = [], activeChat, mensajes = [], onSendMessage, currentUser, randomUsers = [] }) {
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

  const obtenerIdOtroUsuario = () => {
     if (!activeChat) return null;
     return activeChat.uid || activeChat.id || activeChat.otherUserId;
  };

  return (
    <Container className={styles.container}>
      <div className={styles.messagingLayout}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Mensajes</h3>
          </div>
          
          <div className={styles.scrollArea}>
              {chats.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Tus Conversaciones</div>
                  <div className={styles.chatsList}>
                    {chats.map(chat => {
                      const estaSeleccionado = activeChat && (activeChat.id === chat.id || activeChat.uid === chat.otherUserId);
                      return (
                        <div 
                          key={chat.chatId || chat.id} 
                          className={`${styles.chatItem} ${estaSeleccionado ? styles.chatItemActive : ''}`}
                          onClick={() => router.push(`/mensajes/chat?id=${chat.otherUserId || chat.id}`)}
                        >
                          <div className={styles.chatAvatar}>
                            {(chat.fotoPerfil || chat.userAvatar) ? (
                              <img src={chat.fotoPerfil || chat.userAvatar} alt={chat.nombre || chat.userName} />
                            ) : (
                              <div className={styles.avatarPlaceholder}>
                                <User size={18} />
                              </div>
                            )}
                          </div>
                          <div className={styles.chatInfo}>
                            <span className={styles.chatName}>{chat.nombre || chat.userName}</span>
                            <p className={styles.chatLastMessage}>{chat.ultimoMensaje || 'Sin mensajes'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {randomUsers && randomUsers.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Descubrir Atletas</div>
                  <div className={styles.chatsList}>
                    {randomUsers.map(u => (
                      <div key={u.id || u.uid} className={styles.suggestedItem}>
                        <div className={styles.chatAvatar}>
                          {u.fotoPerfil ? (
                            <img src={u.fotoPerfil} alt={u.nombre} />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              <User size={18} />
                            </div>
                          )}
                        </div>
                        <div className={styles.chatInfo}>
                          <span className={styles.chatName}>{u.nombre || 'Atleta'}</span>
                        </div>
                        <div className={styles.suggestedActions}>
                           <button className={styles.iconBtn} onClick={() => router.push(`/perfil?id=${u.id || u.uid}`)}>
                              <ExternalLink size={16} />
                           </button>
                           <button className={styles.iconBtn} onClick={() => router.push(`/mensajes/chat?id=${u.id || u.uid}`)}>
                              <MessageCircle size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        </div>

        <div className={styles.chatWindow}>
          {activeChat ? (
            <>
              <div className={styles.chatHeader}>
                <Link href={`/perfil?id=${obtenerIdOtroUsuario()}`} className={styles.headerUser} style={{ textDecoration: 'none' }}>
                  <div className={styles.chatAvatar}>
                    {(activeChat.userAvatar || activeChat.fotoPerfil) ? (
                      <img src={activeChat.userAvatar || activeChat.fotoPerfil} alt={activeChat.userName || activeChat.nombre} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className={styles.headerInfo}>
                    <span className={styles.headerName}>{activeChat.userName || activeChat.nombre || 'Atleta'}</span>
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  className={styles.profileBtn}
                  onClick={() => router.push(`/perfil?id=${obtenerIdOtroUsuario()}`)}
                >
                  Ver Perfil
                </Button>
              </div>

              <div className={styles.messagesContainer}>
                {mensajes.length === 0 ? (
                  <div className={styles.emptyMessages}>No hay mensajes en los últimos 2 días.</div>
                ) : (
                  mensajes.map(msg => {
                    const esPropio = msg.remitenteId === currentUser?.uid || msg.senderId === currentUser?.uid;
                    return (
                      <div 
                        key={msg.id} 
                        className={`${styles.messageWrapper} ${esPropio ? styles.messageOwn : styles.messageOther}`}
                      >
                        <div className={styles.messageBubble}>
                          <p>{msg.texto}</p>
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
            </>
          ) : (
            <div className={styles.noActiveChat}>
              <MessageSquare size={48} />
              <p>Selecciona una conversación o descubre nuevos Escaladores para empezar a hablar.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}