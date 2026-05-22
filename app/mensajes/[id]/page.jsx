'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatDetailTemplate from '@/components/templates/chatDetail';
import Loader from '@/components/_base/ui/loader';

export default function ChatDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const targetUserUid = id.split('_').find(uid => uid !== user?.uid);
  const { mensajes, loading, otherUser, enviarMensaje } = useChat(user?.uid, targetUserUid);

  if (loading) return <Loader />;

  return (
    <ChatDetailTemplate
      mensajes={mensajes}
      currentUserId={user?.uid}
      otherUserName={otherUser?.nombre || otherUser?.displayName}
      onSendMessage={enviarMensaje}
    />
  );
}