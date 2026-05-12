'use client';

import Home from '@/components/templates/home';

import { useRocodromos } from '@/hooks/useRocodromos';

export default function HomePage() {

  const { data, loading } = useRocodromos();

  return (
    <Home 
      rocodromos={data} 
      loading={loading} 
    />
  );
}