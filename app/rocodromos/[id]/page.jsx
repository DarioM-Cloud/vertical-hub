'use client';

import { useParams } from 'next/navigation';
import RocodromoDetailTemplate from '@/components/templates/rocodromo';
import { useRocodromoDetail } from '@/hooks/useRocodromoDetail';

export default function RocodromoPage() {
  const { id } = useParams();
  const { rocodromo, sectores, loading } = useRocodromoDetail(id);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Cargando centro...</div>;
  }

  return (
    <RocodromoDetailTemplate 
      rocodromo={rocodromo} 
      sectores={sectores} 
    />
  );
}