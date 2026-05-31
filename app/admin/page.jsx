'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRocodromos } from '@/hooks/useRocodromos';
import { useRocodromoDetail } from '@/hooks/useRocodromoDetail';
import SuperAdminDashboardTemplate from '@/components/templates/roles/superAdminDashboard';
import RocoAdminDashboardTemplate from '@/components/templates/roles/rocoAdminDashboard';
import Loader from '@/components/_base/ui/loader';

function SuperAdminContainer() {
  const { rocodromos, loading } = useRocodromos();

  const handleAddRocodromo = async (data) => {
    try {
      await addDoc(collection(db, 'rocodromos'), {
        ...data,
        aforoActual: 0
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRocodromo = async (id) => {
    try {
      await deleteDoc(doc(db, 'rocodromos', id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <SuperAdminDashboardTemplate 
      rocodromos={rocodromos}
      onAddRocodromo={handleAddRocodromo}
      onDeleteRocodromo={handleDeleteRocodromo}
    />
  );
}

function RocoAdminContainer({ rocoId, user }) {
  const { rocodromo, posts, avisos, vias, loading } = useRocodromoDetail(rocoId);

  const handleUpdateOccupancy = async (newCount) => {
    if (!rocodromo) return;
    try {
      await updateDoc(doc(db, 'rocodromos', rocodromo.id), { aforoActual: newCount });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAnnouncement = async (data) => {
    if (!rocodromo) return;
    try {
      await addDoc(collection(db, 'avisos'), {
        ...data,
        rocodromoId: rocodromo.id,
        fecha: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, 'avisos', id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRoute = async (id, data) => {
    try {
      await updateDoc(doc(db, 'vias', id), data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemovePostFromGym = async (id) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        rocodromoId: null,
        rocodromoNombre: null
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <RocoAdminDashboardTemplate 
      currentUserProfile={user}
      gymData={rocodromo}
      announcements={avisos}
      routes={vias}
      localPosts={posts}
      onUpdateOccupancy={handleUpdateOccupancy}
      onAddAnnouncement={handleAddAnnouncement}
      onDeleteAnnouncement={handleDeleteAnnouncement}
      onUpdateRoute={handleUpdateRoute}
      onRemovePostFromGym={handleRemovePostFromGym}
    />
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !user.isSuperAdmin && !user.isRocoAdmin) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;
  if (!user) return null;

  if (user.isSuperAdmin) {
    return <SuperAdminContainer />;
  }

  if (user.isRocoAdmin && user.adminRocoId) {
    return <RocoAdminContainer rocoId={user.adminRocoId} user={user} />;
  }

  return null;
}