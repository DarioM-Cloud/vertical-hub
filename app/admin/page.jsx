'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import SuperAdminDashboardTemplate from '@/components/templates/roles/superAdminDashboard';
import Loader from '@/components/_base/ui/loader';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    rocodromos,
    usuarios,
    fotos,
    loading: dataLoading,
    addRocodromo,
    deleteRocodromo,
    updateUserRole,
    toggleBlockUser,
    updatePhoto
  } = useSuperAdmin();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && !user.isSuperAdmin) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) return <Loader />;
  if (!user || !user.isSuperAdmin) return null;

  return (
    <SuperAdminDashboardTemplate 
      rocodromos={rocodromos}
      usuarios={usuarios}
      fotos={fotos}
      onAddRocodromo={addRocodromo}
      onDeleteRocodromo={deleteRocodromo}
      onUpdateUserRole={updateUserRole}
      onToggleBlockUser={toggleBlockUser}
      onUpdatePhoto={updatePhoto}
    />
  );
}