'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import OwnProfileView from './views/ownProfileView';
import OtherProfileView from './views/otherProfileView';
import GuestProfileView from './views/guestProfileView';
import AdminProfileView from './views/adminProfileView';
import Loader from '@/components/_base/ui/loader';

export default function PerfilTemplate({ targetUserId }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [logbook, setLogbook] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const effectiveUserId = targetUserId || user?.uid;

  useEffect(() => {
    if (!effectiveUserId) {
      setLoadingData(false);
      return;
    }

    const unsubProfile = onSnapshot(doc(db, 'usuarios', effectiveUserId), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProfile(null);
      }
    });

    const qLogbook = query(
      collection(db, 'ascensiones'),
      where('userId', '==', effectiveUserId),
      orderBy('fecha', 'desc')
    );
    const unsubLogbook = onSnapshot(qLogbook, (snapshot) => {
      setLogbook(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qPosts = query(
      collection(db, 'posts'),
      where('autorId', '==', effectiveUserId),
      orderBy('fecha', 'desc')
    );
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingData(false);
    });

    return () => {
      unsubProfile();
      unsubLogbook();
      unsubPosts();
    };
  }, [effectiveUserId]);

  const handleDeletePost = async (postId) => {
    const confirmacion = window.confirm('¿Seguro que quieres borrar esta publicación?');
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async (formData) => {
    if (!user) return;
    try {
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'usuarios', user.uid), formData);
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading || loadingData) return <Loader />;
  
  if (!profile && !effectiveUserId) {
    return <GuestProfileView profile={null} logbook={[]} posts={[]} />;
  }
  
  if (!profile) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Perfil no encontrado</div>;
  }

  const isOwnProfile = user && user.uid === profile.id;
  const isAdmin = user && user.role === 'admin'; 

  if (!user) {
    return (
      <GuestProfileView 
        profile={profile} 
        logbook={logbook} 
        posts={posts} 
      />
    );
  }

  if (isOwnProfile) {
    return (
      <OwnProfileView 
        profile={profile} 
        logbook={logbook} 
        posts={posts}
        onUpdateProfile={handleUpdateProfile}
        onDeletePost={handleDeletePost}
      />
    );
  }

  if (isAdmin) {
    return (
      <AdminProfileView 
        profile={profile} 
        logbook={logbook} 
        posts={posts}
        onDeletePost={handleDeletePost}
      />
    );
  }

  return (
    <OtherProfileView 
      profile={profile} 
      logbook={logbook} 
      posts={posts} 
    />
  );
}