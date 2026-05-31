'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

export function useSuperAdmin() {
  const [rocodromos, setRocodromos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubRocos = onSnapshot(collection(db, 'rocodromos'), (snap) => {
      setRocodromos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, 'usuarios'), (snap) => {
      setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubRocos();
      unsubUsers();
      unsubPosts();
    };
  }, []);

  useEffect(() => {
    if (!rocodromos.length && !usuarios.length && !posts.length) return;

    const bancoFotos = [];

    rocodromos.forEach(r => {
      if (r.imagenUrl) {
        bancoFotos.push({
          uid: `roco_${r.id}`,
          coleccion: 'rocodromos',
          id: r.id,
          campo: 'imagenUrl',
          url: r.imagenUrl,
          origen: `Rocódromo: ${r.nombre}`
        });
      }
    });

    usuarios.forEach(u => {
      if (u.fotoPerfil) {
        bancoFotos.push({
          uid: `user_${u.id}`,
          coleccion: 'usuarios',
          id: u.id,
          campo: 'fotoPerfil',
          url: u.fotoPerfil,
          origen: `Avatar: ${u.nombre || u.email}`
        });
      }
    });

    posts.forEach(p => {
      if (p.mediaUrl) {
        bancoFotos.push({
          uid: `post_${p.id}`,
          coleccion: 'posts',
          id: p.id,
          campo: 'mediaUrl',
          url: p.mediaUrl,
          origen: `Post de: ${p.autorNombre || 'Usuario'}`
        });
      }
    });

    setFotos(bancoFotos);
    setLoading(false);
  }, [rocodromos, usuarios, posts]);

  const addRocodromo = async (data) => {
    try {
      await addDoc(collection(db, 'rocodromos'), { ...data, aforoActual: 0 });
    } catch (error) {}
  };

  const deleteRocodromo = async (id) => {
    try {
      await deleteDoc(doc(db, 'rocodromos', id));
    } catch (error) {}
  };

  const updateUserRole = async (id, newRole, adminRocoId = null) => {
    try {
      await updateDoc(doc(db, 'usuarios', id), { rol: newRole, adminRocoId });
    } catch (error) {}
  };

  const toggleBlockUser = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'usuarios', id), { bloqueado: !currentStatus });
    } catch (error) {}
  };

  const updatePhoto = async (coleccion, id, campo, nuevaUrl) => {
    try {
      await updateDoc(doc(db, coleccion, id), { [campo]: nuevaUrl });
    } catch (error) {}
  };

  return {
    rocodromos,
    usuarios,
    fotos,
    loading,
    addRocodromo,
    deleteRocodromo,
    updateUserRole,
    toggleBlockUser,
    updatePhoto
  };
}