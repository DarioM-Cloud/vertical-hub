'use client';

import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import PerfilTemplate from '@/components/templates/perfil';
import Loader from '@/components/_base/ui/loader';

export default function PerfilPage() {
  const { user } = useAuth();
  const { profile, logbook, loading, updateProfile } = useUserProfile(user?.uid);

  if (loading) return <Loader />;

  return (
    <PerfilTemplate 
      profile={profile} 
      logbook={logbook} 
      currentUserId={user?.uid || null} 
      currentUserRole={user?.rol || 'user'} 
      onUpdateProfile={updateProfile}
    />
  );
}