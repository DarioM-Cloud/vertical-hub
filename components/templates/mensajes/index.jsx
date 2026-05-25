'use client';

import Link from 'next/link';
import { MessageSquare, User, ChevronRight, UserPlus } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './mensajes.module.scss';

export default function MensajesTemplate({ chats = [], randomUsers = [], currentUser }) {
  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <h1>Mensajes</h1>
      </header>

      <div className={styles.content}>
        {chats.length > 0 ? (
          <div className={styles.chatList}>
            {chats.map(chat => {
              const comboId = [currentUser?.uid, chat.friendId].sort().join('_');
              return (
                <Link key={chat.chatId} href={`/mensajes/${comboId}`} className={styles.chatCard}>
                  <div className={styles.avatar}>
                    {chat.fotoPerfil ? (
                      <img src={chat.fotoPerfil} alt={chat.nombre} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className={styles.chatInfo}>
                    <span className={styles.name}>{chat.nombre}</span>
                  </div>
                  <ChevronRight size={20} className={styles.arrow} />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <MessageSquare size={48} />
            </div>
            <h2>Empieza a conversar</h2>
            <p>Aún no tienes chats activos. Aquí tienes algunos escaladores con los que podrías conectar:</p>
            
            <div className={styles.randomUsersList}>
              {randomUsers.map(user => (
                <div key={user.id} className={styles.randomUserCard}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatarSmall}>
                      {user.fotoPerfil ? (
                        <img src={user.fotoPerfil} alt={user.nombre} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.name}>{user.nombre}</span>
                      <span className={styles.level}>{user.nivelEscalada || 'Sin nivel'}</span>
                    </div>
                  </div>
                  <Link href={`/perfil/${user.id}`}>
                    <Button variant="outline" className={styles.connectBtn}>
                      <UserPlus size={16} />
                      Ver perfil
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}