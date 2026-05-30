'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import SuperAdminDashboardTemplate from '@/components/templates/superAdminDashboard';
import RocoAdminDashboardTemplate from '@/components/templates/rocoAdminDashboard';
import Loader from '@/components/_base/ui/loader';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [rocodromos, setRocodromos] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [localPosts, setLocalPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user) {
      if (user.isSuperAdmin) {
        fetchAllRocodromos();
      } else if (user.isRocoAdmin && user.adminRocoId) {
        fetchGymData(user.adminRocoId);
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const fetchAllRocodromos = async () => {
    setIsFetching(true);
    try {
      const snap = await getDocs(collection(db, 'rocodromos'));
      setRocodromos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {}
    setIsFetching(false);
  };

  const fetchGymData = async (rocoId) => {
    setIsFetching(true);
    try {
      const gymRef = doc(db, 'rocodromos', rocoId);
      const gymSnap = await getDoc(gymRef);
      if (gymSnap.exists()) {
        setGymData({ id: gymSnap.id, ...gymSnap.data() });
      }

      const annSnap = await getDocs(collection(db, `rocodromos/${rocoId}/anuncios`));
      setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const routesSnap = await getDocs(collection(db, `rocodromos/${rocoId}/vias`));
      setRoutes(routesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const postsQuery = query(collection(db, 'posts'), where('rocodromoId', '==', rocoId));
      const postsSnap = await getDocs(postsQuery);
      setLocalPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {}
    setIsFetching(false);
  };

  const handleAddRocodromo = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'rocodromos'), data);
      setRocodromos([...rocodromos, { id: docRef.id, ...data }]);
    } catch (error) {}
  };

  const handleDeleteRocodromo = async (id) => {
    try {
      await deleteDoc(doc(db, 'rocodromos', id));
      setRocodromos(rocodromos.filter(r => r.id !== id));
    } catch (error) {}
  };

  const handleUpdateOccupancy = async (newCount) => {
    if (!gymData) return;
    try {
      await updateDoc(doc(db, 'rocodromos', gymData.id), { ocupacionActual: newCount });
      setGymData({ ...gymData, ocupacionActual: newCount });
    } catch (error) {}
  };

  const handleAddAnnouncement = async (data) => {
    if (!gymData) return;
    try {
      const docRef = await addDoc(collection(db, `rocodromos/${gymData.id}/anuncios`), {
        ...data,
        fecha: serverTimestamp()
      });
      setAnnouncements([...announcements, { id: docRef.id, ...data }]);
    } catch (error) {}
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!gymData) return;
    try {
      await deleteDoc(doc(db, `rocodromos/${gymData.id}/anuncios`, id));
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {}
  };

  const handleUpdateRoute = async (id, data) => {
    if (!gymData) return;
    try {
      await updateDoc(doc(db, `rocodromos/${gymData.id}/vias`, id), data);
      setRoutes(routes.map(r => r.id === id ? { ...r, ...data } : r));
    } catch (error) {}
  };

  const handleRemovePostFromGym = async (id) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        rocodromoId: null,
        rocodromoNombre: null
      });
      setLocalPosts(localPosts.filter(p => p.id !== id));
    } catch (error) {}
  };

  if (loading || isFetching) return <Loader />;

  if (user?.isSuperAdmin) {
    return (
      <SuperAdminDashboardTemplate 
        rocodromos={rocodromos}
        onAddRocodromo={handleAddRocodromo}
        onDeleteRocodromo={handleDeleteRocodromo}
      />
    );
  }

  if (user?.isRocoAdmin) {
    return (
      <RocoAdminDashboardTemplate 
        currentUserProfile={user}
        gymData={gymData}
        announcements={announcements}
        routes={routes}
        localPosts={localPosts}
        onUpdateOccupancy={handleUpdateOccupancy}
        onAddAnnouncement={handleAddAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        onUpdateRoute={handleUpdateRoute}
        onRemovePostFromGym={handleRemovePostFromGym}
      />
    );
  }

  return null;
}