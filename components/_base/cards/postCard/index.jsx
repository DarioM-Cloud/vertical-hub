'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import styles from './postCard.module.scss';

export default function PostCard({ data }) {
  const formattedDate = data.fecha?.toDate 
    ? new Intl.DateTimeFormat('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(data.fecha.toDate()) 
    : 'Hace un momento';

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
        </div>
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
        <button className={styles.actionBtn}>
          <Heart size={18} />
          <span>{data.likes || 0}</span>
        </button>
        <button className={styles.actionBtn}>
          <MessageCircle size={18} />
          <span>{data.comentarios || 0}</span>
        </button>
        <button className={styles.actionBtn}>
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}