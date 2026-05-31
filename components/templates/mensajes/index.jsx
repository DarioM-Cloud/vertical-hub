'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, User, MessageSquare, ExternalLink, MessageCircle, MoreHorizontal, Trash2, X, Eye, Lock } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useGlobalCounters } from '@/hooks/useGlobalCounters';
import styles from './mensajes.module.scss';

function ChatItemRow({ chat, activeChat, router, onClearChat, onDeleteChat, unreadCount }) {
  const [foto, setFoto] = useState(chat.fotoPerfil || chat.userAvatar);
  const [showMenu, setShowMenu] = useState(false);
  const estaSeleccionado = activeChat && (activeChat.id === chat.id || activeChat.uid === chat.otherUserId);
  const otroUsuarioId = chat.otherUserId || chat.id;

  useEffect(() => {
    if (!otroUsuarioId) return;
    const fetchFoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', otroUsuarioId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFoto(data.fotoPerfil || data.photoURL || null);
        }
      } catch (error) {}
    };
    fetchFoto();
  }, [otroUsuarioId]);

  return (
    <div 
      className={`${styles.chatItem} ${estaSeleccionado ? styles.chatItemActive : ''}`}
      onClick={() => router.push(`/mensajes/chat?id=${otroUsuarioId}`)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '12px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <div 
          className={styles.chatAvatar}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/perfil?id=${otroUsuarioId}`);
          }}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          {foto ? (
            <img src={foto} alt={chat.nombre || chat.userName} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={18} />
            </div>
          )}
        </div>
        <div className={styles.chatInfo} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={styles.chatName} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: unreadCount > 0 ? '800' : 'normal' }}>
              {chat.nombre || chat.userName}
            </span>
            {unreadCount > 0 && (
              <span style={{ background: '#3b82f6', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className={styles.chatLastMessage} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: unreadCount > 0 ? '700' : 'normal', color: unreadCount > 0 ? '#3b82f6' : '#64748b' }}>
            {chat.ultimoMensaje || 'Sin mensajes'}
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', marginLeft: '8px' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <MoreHorizontal size={20} />
        </button>
        {showMenu && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
            <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 999, minWidth: '160px', overflow: 'hidden', marginTop: '4px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); router.push(`/perfil?id=${otroUsuarioId}`); setShowMenu(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}
              >
                <Eye size={16} /> Ver Perfil
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClearChat(chat.chatId || chat.id); 
                  setShowMenu(false); 
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left', borderTop: '1px solid #f1f5f9' }}
              >
                <MessageCircle size={16} /> Vaciar Chat
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDeleteChat(chat.chatId || chat.id); 
                  setShowMenu(false); 
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left', borderTop: '1px solid #f1f5f9' }}
              >
                <Trash2 size={16} /> Borrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SuggestedItemRow({ u, router }) {
  const [foto, setFoto] = useState(u.fotoPerfil);
  const usuarioId = u.id || u.uid;

  useEffect(() => {
    if (!usuarioId) return;
    const fetchFoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', usuarioId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFoto(data.fotoPerfil || data.photoURL || null);
        }
      } catch (error) {}
    };
    fetchFoto();
  }, [usuarioId]);

  return (
    <div className={styles.suggestedItem}>
      <div 
        className={styles.chatAvatar}
        onClick={() => router.push(`/perfil?id=${usuarioId}`)}
        style={{ cursor: 'pointer' }}
      >
        {foto ? (
          <img src={foto} alt={u.nombre} />
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
         <button className={styles.iconBtn} onClick={() => router.push(`/perfil?id=${usuarioId}`)}>
            <ExternalLink size={16} />
         </button>
         <button className={styles.iconBtn} onClick={() => router.push(`/mensajes/chat?id=${usuarioId}`)}>
            <MessageCircle size={16} />
         </button>
      </div>
    </div>
  );
}

export default function MensajesTemplate({ chats = [], activeChat, mensajes = [], onSendMessage, currentUser, randomUsers = [] }) {
  const router = useRouter();
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [activeChatPhoto, setActiveChatPhoto] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { unreadPerChat } = useGlobalCounters(currentUser?.uid);

  const filteredChats = chats.filter(c => c.rol !== 'superadmin' && c.rol !== 'rocoadmin' && c.otherUserRole !== 'superadmin' && c.otherUserRole !== 'rocoadmin');
  const filteredRandomUsers = randomUsers.filter(u => u.rol !== 'superadmin' && u.rol !== 'rocoadmin');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const obtenerIdOtroUsuario = () => {
     if (!activeChat) return null;
     return activeChat.uid || activeChat.id || activeChat.otherUserId;
  };

  const idDestino = obtenerIdOtroUsuario();
  const chatId = activeChat?.chatId || activeChat?.id;

  useEffect(() => {
    if (!idDestino) return;
    const fetchActivePhoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', idDestino);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setActiveChatPhoto(data.fotoPerfil || data.photoURL || null);
        }
      } catch (error) {}
    };
    fetchActivePhoto();
  }, [idDestino]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    onSendMessage(nuevoMensaje);
    setNuevoMensaje('');
  };

  const internalClearChat = async (targetId) => {
    const id = targetId || chatId;
    if (!id) return;
    
    if(confirm('¿Seguro que quieres vaciar el chat? Se borrarán todos los mensajes de esta conversación.')) {
      try {
        const mensajesRef = collection(db, 'chats', id, 'mensajes');
        const mensajesSnap = await getDocs(mensajesRef);
        const batch = writeBatch(db);
        mensajesSnap.forEach((d) => batch.delete(d.ref));
        await batch.commit();

        await updateDoc(doc(db, 'chats', id), {
          ultimoMensaje: 'Chat vaciado'
        });
      } catch(e) {}
      setShowMenu(false);
    }
  };

  const internalDeleteChat = async (targetId) => {
    const id = targetId || chatId;
    if (!id) return;

    if(confirm('¿Seguro que quieres borrar este chat por completo?')) {
      try {
        const mensajesRef = collection(db, 'chats', id, 'mensajes');
        const mensajesSnap = await getDocs(mensajesRef);
        const batch = writeBatch(db);
        mensajesSnap.forEach((d) => batch.delete(d.ref));
        await batch.commit();

        await deleteDoc(doc(db, 'chats', id));
      } catch(e) {}
      
      setShowMenu(false);
      if (chatId === id) {
        router.push('/mensajes');
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
    <Container className={styles.container}>
      <div className={styles.messagingLayout}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Mensajes</h3>
          </div>
          
          <div className={styles.scrollArea}>
              {filteredChats.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Tus Conversaciones</div>
                  <div className={styles.chatsList}>
                    {filteredChats.map(chat => (
                      <ChatItemRow 
                        key={chat.chatId || chat.id} 
                        chat={chat} 
                        activeChat={activeChat} 
                        router={router} 
                        onClearChat={internalClearChat}
                        onDeleteChat={internalDeleteChat}
                        unreadCount={unreadPerChat[chat.chatId || chat.id] || 0}
                      />
                    ))}
                  </div>
                </>
              )}

              {filteredRandomUsers && filteredRandomUsers.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Descubrir Atletas</div>
                  <div className={styles.chatsList}>
                    {filteredRandomUsers.map(u => (
                      <SuggestedItemRow key={u.id || u.uid} u={u} router={router} />
                    ))}
                  </div>
                </>
              )}
          </div>
        </div>

        <div className={styles.chatWindow}>
          {activeChat ? (
            <>
              <div className={styles.chatHeader} style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', overflow: 'visible', paddingRight: '16px' }}>
                <Link href={`/perfil?id=${idDestino}`} className={styles.headerUser} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={styles.chatAvatar}>
                    {activeChatPhoto ? (
                      <img src={activeChatPhoto} alt={activeChat.userName || activeChat.nombre} />
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
                
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}
                  >
                    <MoreHorizontal size={24} />
                  </button>

                  {showMenu && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowMenu(false)}></div>
                      <div style={{ position: 'absolute', right: '0px', top: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 999, minWidth: '180px', overflow: 'hidden', marginTop: '8px' }}>
                        <button 
                          onClick={() => { router.push(`/perfil?id=${idDestino}`); setShowMenu(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}
                        >
                          <Eye size={18} /> Ver Perfil
                        </button>
                        <button 
                          onClick={() => internalClearChat()}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left', borderTop: '1px solid #f1f5f9' }}
                        >
                          <MessageCircle size={18} /> Vaciar Chat
                        </button>
                        <button 
                          onClick={() => internalDeleteChat()}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left', borderTop: '1px solid #f1f5f9' }}
                        >
                          <Trash2 size={18} /> Borrar Chat
                        </button>
                        <button 
                          onClick={() => setShowMenu(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: '#f8fafc', border: 'none', borderTop: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}
                        >
                          <X size={18} /> Cancelar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.messagesContainer}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '6px 12px', borderRadius: '12px' }}>
                    <Lock size={12} />
                    <span>Tus mensajes están cifrados de extremo a extremo.</span>
                  </div>
                </div>

                {mensajes.length === 0 ? (
                  <div className={styles.emptyMessages}>Aún no hay mensajes. ¡Rompe el hielo!</div>
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
                <div ref={messagesEndRef} />
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
    </div>
  );
}