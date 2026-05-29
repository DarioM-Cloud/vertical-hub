import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'usuarios', authUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({ 
              ...authUser, 
              ...userData, 
              uid: authUser.uid,
              isSuperAdmin: userData.rol === 'superadmin',
              isRocoAdmin: userData.rol === 'rocoadmin',
              adminRocoId: userData.adminRocoId || null
            });
          } else {
            setUser({
              ...authUser,
              isSuperAdmin: false,
              isRocoAdmin: false,
              adminRocoId: null
            });
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, loading };
}