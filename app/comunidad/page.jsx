'use client';

import ComunidadTemplate from '@/components/templates/comunidad';
import { useAuth } from '@/context/AuthContext';
import { usePosts, useFeedPosts } from '@/hooks/usePosts';
import { usePartnerCheck } from '@/hooks/usePartnerCheck';
import { useRocodromos } from '@/hooks/useRocodromos';
import Loader from '@/components/_base/ui/loader';

export default function ComunidadPage() {
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = useFeedPosts();
  const { createPost, progress } = usePosts();
  const { tickets, loading: ticketsLoading, addTicket, deleteTicket, toggleJoinTicket } = usePartnerCheck();
  const { rocodromos, loading: rocosLoading } = useRocodromos();

  if (authLoading || postsLoading || ticketsLoading || rocosLoading) return <Loader />;

  return (
    <ComunidadTemplate 
      currentUser={user} 
      posts={posts} 
      tickets={tickets}
      rocodromos={rocodromos}
      onAddPost={createPost}
      uploadProgress={progress}
      onAddTicket={addTicket}
      onDeleteTicket={deleteTicket}
      onToggleJoin={toggleJoinTicket}
    />
  );
}