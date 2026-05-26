'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PerfilTemplate from '@/components/templates/perfil';
import Loader from '@/components/_base/ui/loader';

function PerfilContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <PerfilTemplate targetUserId={id} />;
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PerfilContent />
    </Suspense>
  );
}