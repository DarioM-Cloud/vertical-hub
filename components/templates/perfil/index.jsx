'use client';

import GuestProfileView from './views/guestProfileView';
import OwnProfileView from './views/ownProfileView';
import OtherProfileView from './views/otherProfileView';
import AdminProfileView from './views/adminProfileView';

export default function PerfilTemplate({ profile, logbook, currentUserId, currentUserRole, onUpdateProfile }) {
  if (!currentUserId) {
    return <GuestProfileView />;
  }

  if (!profile) return null;

  const isOwnProfile = currentUserId === profile.id;
  const isAdmin = currentUserRole === 'admin';

  if (isOwnProfile) {
    return <OwnProfileView profile={profile} logbook={logbook} onUpdateProfile={onUpdateProfile} />;
  }

  if (isAdmin) {
    return <AdminProfileView profile={profile} logbook={logbook} currentUserId={currentUserId} />;
  }

  return <OtherProfileView profile={profile} logbook={logbook} currentUserId={currentUserId} />;
}