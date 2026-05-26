'use client';

import { useState } from 'react';
import { Heart, MessageCircle, MapPin, Send, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import styles from './postCard.module.scss';

export default function PostCard({ data }) {
  const { user } = useAuth();
  const { deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

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
  
  // Ahora comprobamos si el que navega es el dueño del post para dejarle borrarlo desde aquí
  const isOwner = user && (user.uid === data.autorId || user.uid === data.userId);

  const handleLike = async () => {
    if (!user) return alert("Inicia sesión para dar me gusta");
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
    if (!user) return alert("Inicia sesión para comentar");
    if (!commentText.trim() || isCommenting) return;
    
    setIsCommenting(true);
    const postRef = doc(db, 'posts', data.id);
    
    const newComment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.nombre || user.email?.split('@')[0] || 'Atleta',
      userAvatar: user.photoURL || user.fotoPerfil || '',
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
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          {data.userAvatar ? (
            <img src={data.userAvatar} alt={data.userName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {data.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{data.userName}</span>
          <span className={styles.date}>{formattedDate}</span>
          {data.rocodromoNombre && (
            <span className={styles.rocodromoTag}>
              <MapPin size={12} />
              {data.rocodromoNombre}
            </span>
          )}
        </div>
        
        {isOwner && (
          <button className={styles.deleteBtn} onClick={() => deletePost(data.id)}>
            <Trash2 size={16} />
          </button>
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
        <button 
          className={`${styles.actionBtn} ${hasLiked ? styles.liked : ''}`} 
          onClick={handleLike}
          disabled={isLiking}
        >
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
                  <div className={styles.commentAvatar}>
                    {c.userAvatar ? (
                      <img src={c.userAvatar} alt={c.userName} />
                    ) : (
                      <div className={styles.commentAvatarPlaceholder}>
                        {c.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.commentBubble}>
                    <span className={styles.commentName}>{c.userName}</span>
                    <p className={styles.commentText}>{c.texto}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <form className={styles.commentForm} onSubmit={handleComment}>
            <input 
              type="text" 
              placeholder="Escribe un comentario..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isCommenting}
            />
            <button type="submit" disabled={!commentText.trim() || isCommenting} className={styles.sendBtn}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}