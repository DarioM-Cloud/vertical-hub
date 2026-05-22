'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import styles from './mensajes.module.scss';

export default function MensajesTemplate({ chats }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h2>Mensajes</h2>
      </header>

      <div className={styles.list}>
        {chats.length === 0 ? (
          <p className={styles.empty}>No tienes mensajes aún.</p>
        ) : (
          chats.map((chat) => (
            <Link href={`/mensajes/${chat.id}`} key={chat.id} className={styles.chatItem}>
              <div className={styles.avatar}>
                <User size={20} />
              </div>
              <div className={styles.info}>
                <span className={styles.userName}>{chat.nombreInterlocutor}</span>
                <span className={styles.lastMessage}>{chat.ultimoMensaje}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}