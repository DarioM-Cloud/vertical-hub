'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, MapPin, Send, Trash2, User, MoreHorizontal, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import styles from './postCard.module.scss';

export default function PostCard({ data }) {
  const { user } = useAuth();
  const { deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [currentAuthorPhoto, setCurrentAuthorPhoto] = useState(data.autorFoto || data.userAvatar);
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = data.fecha?.toDate 
    ? new Intl.DateTimeFormat('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(data.fecha.toDate()) 
    : 'Hace un momento';

  const hasLiked = data.likedBy?.includes(user?.uid);
  const comentarios = data.comentariosLista || [];
  const isOwner = user && (user.uid === data.autorId || user.uid === data.userId);
  const authorId = data.autorId || data.userId;

  useEffect(() => {
    if (!authorId) return;
    const fetchCurrentPhoto = async () => {
      try {
        const userRef = doc(db, 'usuarios', authorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCurrentAuthorPhoto(userData.fotoPerfil || userData.photoURL || null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentPhoto();
  }, [authorId]);

  const handleLike = async () => {
    if (!user) return;
    if (isLiking) return;
    setIsLiking(true);
    const postRef = doc(db, 'posts', data.id);
    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
      }
    } catch (e) {
      console.error(e);
    }
    setIsLiking(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!commentText.trim() || isCommenting) return;
    setIsCommenting(true);
    const postRef = doc(db, 'posts', data.id);
    const newComment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.nombre || 'Atleta',
      userAvatar: user.fotoPerfil || user.photoURL || '',
      texto: commentText,
      fecha: new Date().toISOString()
    };
    try {
      await updateDoc(postRef, {
        comentarios: increment(1),
        comentariosLista: arrayUnion(newComment)
      });
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
    setIsCommenting(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Link href={`/perfil?id=${authorId}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.avatarWrapper} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentAuthorPhoto ? (
              <img src={currentAuthorPhoto} alt={data.userName || data.autorNombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={20} color="#64748b" />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName} style={{ fontWeight: '700', fontSize: '15px' }}>{data.userName || data.autorNombre || 'Atleta'}</span>
            <span className={styles.date} style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>{formattedDate}</span>
            {data.rocodromoNombre && (
              <span className={styles.rocodromoTag} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>
                <MapPin size={12} />
                {data.rocodromoNombre}
              </span>
            )}
          </div>
        </Link>
        
        {isOwner && (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }} 
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px' }}
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div style={{ position: 'absolute', right: 0, top: '40px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '160px', overflow: 'hidden' }}>
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if(confirm('¿Seguro que quieres eliminar esta publicación?')) {
                      deletePost(data.id);
                    }
                    setShowMenu(false); 
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' }}
                >
                  <Trash2 size={18} /> Eliminar
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: '#f8fafc', border: 'none', borderTop: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' }}
                >
                  <X size={18} /> Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        {data.texto && <p className={styles.text}>{data.texto}</p>}
        {data.mediaUrl && (
          <div className={styles.mediaContainer}>
            {data.mediaType === 'video' ? (
              <video src={data.mediaUrl} controls className={styles.media} />
            ) : (
              <img src={data.mediaUrl} alt="Publicación" className={styles.media} loading="lazy" />
            )}
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        <button className={`${styles.actionBtn} ${hasLiked ? styles.liked : ''}`} onClick={handleLike} disabled={isLiking}>
          <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{data.likes || 0}</span>
        </button>
        <button className={styles.actionBtn} onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={18} />
          <span>{data.comentarios || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsList}>
            {comentarios.length === 0 ? (
              <span className={styles.noComments}>Aún no hay comentarios.</span>
            ) : (
              comentarios.map(c => (
                <div key={c.id} className={styles.commentItem}>
                  <Link href={`/perfil?id=${c.userId}`} className={styles.commentAvatar} style={{ textDecoration: 'none' }}>
                    {c.userAvatar ? (
                      <img src={c.userAvatar} alt={c.userName} />
                    ) : (
                      <div className={styles.commentAvatarPlaceholder} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>
                        {c.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className={styles.commentBubble}>
                    <Link href={`/perfil?id=${c.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className={styles.commentName}>{c.userName}</span>
                    </Link>
                    <p className={styles.commentText}>{c.texto}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form className={styles.commentForm} onSubmit={handleComment}>
            <input type="text" placeholder="Escribe un comentario..." value={commentText} onChange={(e) => setCommentText(e.target.value)} disabled={isCommenting} />
            <button type="submit" disabled={!commentText.trim() || isCommenting} className={styles.sendBtn}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}