'use client';

import { useComunidadPosts } from '@/hooks/useComunidadPosts';
import { usePartnerCheck } from '@/hooks/usePartnerCheck';
import { useRocodromos } from '@/hooks/useRocodromos';
import { useAuth } from '@/context/AuthContext';
import ComunidadTemplate from '@/components/templates/comunidad';
import Loader from '@/components/_base/ui/loader';

export default function ComunidadPage() {
  const { user } = useAuth();
  const { posts, loading: loadingPosts, addPost } = useComunidadPosts();
  const { tickets, loading: loadingTickets, addTicket } = usePartnerCheck();
  const { rocodromos, loading: loadingRocos } = useRocodromos();

  if (loadingPosts || loadingTickets || loadingRocos) return <Loader />;

  return (
    <ComunidadTemplate 
      posts={posts || []} 
      tickets={tickets || []} 
      rocodromos={rocodromos || []}
      currentUser={user}
      onAddPost={addPost}
      onAddTicket={addTicket}
    />
  );
}