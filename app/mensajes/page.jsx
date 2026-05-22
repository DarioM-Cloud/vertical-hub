'use client';

import { useAuth } from '@/hooks/useAuth';
import { useInbox } from '@/hooks/useInbox';
import MensajesTemplate from '@/components/templates/mensajes';
import Loader from '@/components/_base/ui/loader';

export default function MensajesPage() {
  const { user } = useAuth();
  const { chats, loading } = useInbox(user?.uid);

  if (loading) return <Loader />;

  return <MensajesTemplate chats={chats} />;
}