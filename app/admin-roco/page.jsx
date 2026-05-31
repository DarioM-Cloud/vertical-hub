'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRocoAdminActions } from '@/hooks/useRocoAdminActions';
import { db } from '@/lib/firebase';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import RocoAdminDashboardTemplate from '@/components/templates/roles/rocoAdminDashboard';
import Loader from '@/components/_base/ui/loader';

export default function AdminRocoPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [gymData, setGymData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [localPosts, setLocalPosts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const rocoId = user?.adminRocoId;
  const { updateOccupancy, updateRoute, removePostFromGym } = useRocoAdminActions(rocoId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (!authLoading && user && !user.isRocoAdmin) {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!rocoId) {
      setDataLoading(false);
      return;
    }

    const unsubGym = onSnapshot(doc(db, 'rocodromos', rocoId), (docSnap) => {
      if (docSnap.exists()) {
        setGymData({ id: docSnap.id, ...docSnap.data() });
      }
    });

    const qRoutes = query(collection(db, 'vias'), where('rocodromoId', '==', rocoId));
    const unsubRoutes = onSnapshot(qRoutes, (snap) => {
      setRoutes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qPosts = query(collection(db, 'posts'), where('rocodromoId', '==', rocoId));
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      setLocalPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDataLoading(false);
    });

    return () => {
      unsubGym();
      unsubRoutes();
      unsubPosts();
    };
  }, [rocoId]);

  if (authLoading || dataLoading) return <Loader />;
  if (!user || !user.isRocoAdmin || !gymData) return null;

  return (
    <RocoAdminDashboardTemplate 
      currentUserProfile={user}
      gymData={gymData}
      routes={routes}
      localPosts={localPosts}
      onUpdateOccupancy={updateOccupancy}
      onUpdateRoute={updateRoute}
      onRemovePostFromGym={removePostFromGym}
    />
  );
}