'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import Loader from '@/components/_base/ui/loader';
import ChatDetailTemplate from '@/components/templates/chatDetail';

export default function ChatDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();

  if (!id) return <Loader />;

  const idUsuarioDestino = id.split('_').find(uid => uid !== user?.uid);
  const { mensajes, loading, otherUser, enviarMensaje } = useChat(user?.uid, idUsuarioDestino);

  if (loading) return <Loader />;

  return (
    <ChatDetailTemplate 
      mensajes={mensajes} 
      currentUserId={user?.uid} 
      otroUsuarioId={idUsuarioDestino}
      otherUserName={otherUser?.nombre} 
      onSendMessage={enviarMensaje} 
    />
  );
}