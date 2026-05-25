'use client';

import { useRocodromoDetail } from '@/hooks/useRocodromoDetail';
import { useAscensiones } from '@/hooks/useAscensiones';
import { useAuth } from '@/context/AuthContext';
import RocodromoTemplate from '@/components/templates/rocodromo';
import Loader from '@/components/_base/ui/loader';

export default function ClientPage({ id }) {
  const { user } = useAuth();
  const { rocodromo, posts, avisos, vias, loading } = useRocodromoDetail(id);
  const { addAscension, submitting } = useAscensiones();

  if (loading) return <Loader />;
  if (!rocodromo) return <div style={{ padding: '100px', textAlign: 'center' }}>Rocódromo no encontrado</div>;

  return (
    <RocodromoTemplate 
      rocodromo={rocodromo} 
      posts={posts} 
      avisos={avisos} 
      vias={vias || []}
      currentUser={user}
      onAddAscension={addAscension}
      submittingAscension={submitting}
    />
  );
}