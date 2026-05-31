'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import AdminRolesTemplate from '@/components/templates/roles/adminRoles';
import Loader from '@/components/_base/ui/loader';

export default function AdminRolesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [rocodromos, setRocodromos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (!loading && user) {
      if (!user.isSuperAdmin) {
        router.push('/');
        return;
      }
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const usersSnap = await getDocs(collection(db, 'usuarios'));
      setUsuarios(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const rocoSnap = await getDocs(collection(db, 'rocodromos'));
      setRocodromos(rocoSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
  };

  const handleUpdateUserRole = async (userId, nuevoRol, adminRocoId = null) => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        rol: nuevoRol,
        adminRocoId: nuevoRol === 'rocoadmin' ? adminRocoId : null
      });
      setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, rol: nuevoRol, adminRocoId: nuevoRol === 'rocoadmin' ? adminRocoId : null } : u));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || isFetching) return <Loader />;

  return (
    <AdminRolesTemplate
      usuarios={usuarios}
      rocodromos={rocodromos}
      onUpdateUserRole={handleUpdateUserRole}
    />
  );
}