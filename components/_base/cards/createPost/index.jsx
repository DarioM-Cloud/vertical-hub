'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import Button from '@/components/_base/ui/button';
import styles from './createPost.module.scss';

export default function CreatePost({ user, onSubmit }) {
  const [texto, setTexto] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [publicando, setPublicando] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFile } = useStorage();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setArchivo(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim() && !archivo) return;
    
    setPublicando(true);
    let mediaUrl = null;

    try {
      if (archivo) {
        const extension = archivo.name.split('.').pop();
        const fileName = `post_${Date.now()}.${extension}`;
        mediaUrl = await uploadFile(archivo, `posts/${user.uid}`, fileName);
      }

      await onSubmit({
        texto,
        mediaUrl,
        mediaType: archivo ? 'image' : null
      });

      setTexto('');
      handleRemoveFile();
    } catch (error) {
      console.error(error);
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div className={styles.createPostCard}>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="¿Qué tal el entreno de hoy?" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)}
          className={styles.textarea}
        />
        
        {preview && (
          <div className={styles.previewContainer}>
            <button type="button" onClick={handleRemoveFile} className={styles.removeBtn}><X size={16} /></button>
            <img src={preview} alt="Vista previa" className={styles.previewImg} />
          </div>
        )}

        <div className={styles.actions}>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: 'none' }} />
          <button type="button" className={styles.iconBtn} onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={20} />
          </button>
          <Button variant="primary" type="submit" disabled={publicando || (!texto.trim() && !archivo)}>
            {publicando ? <Loader2 size={18} className={styles.spinner} /> : 'Publicar'}
          </Button>
        </div>
      </form>
    </div>
  );
}