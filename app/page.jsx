'use client';

import { useRocodromos } from '@/hooks/useRocodromos';
import { usePartnerCheck } from '@/hooks/usePartnerCheck';
import HomeTemplate from '@/components/templates/home';
import Loader from '@/components/_base/ui/loader';

export default function HomePage() {
  const { rocodromos, loading: loadingRocos } = useRocodromos();
  const { tickets, loading: loadingTickets } = usePartnerCheck();

  if (loadingRocos || loadingTickets) return <Loader />;

  return <HomeTemplate rocodromos={rocodromos || []} tickets={tickets || []} />;
}