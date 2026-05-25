'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Video, X, Send } from 'lucide-react';
import Button from '@/components/_base/ui/button';
import { usePosts } from '@/hooks/usePosts';
import styles from './createPost.module.scss';

export default function CreatePost({ rocodromoId, currentUser }) {
  const [texto, setTexto] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { createPost, submitting, progress } = usePosts();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setPreview({ 
      url: objectUrl, 
      type: selected.type.startsWith('video/') ? 'video' : 'image' 
    });
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim() && !file) return;

    await createPost(
      rocodromoId,
      currentUser.uid,
      currentUser.nombre || currentUser.email?.split('@')[0] || 'Escalador',
      currentUser.fotoPerfil || '',
      texto,
      file
    );

    setTexto('');
    clearFile();
  };

  if (!currentUser) {
    return (
      <div className={styles.loginPrompt}>
        Inicia sesión para publicar en la comunidad.
      </div>
    );
  }

  return (
    <form className={styles.createPostForm} onSubmit={handleSubmit}>
      <div className={styles.inputArea}>
        {currentUser.fotoPerfil ? (
          <img src={currentUser.fotoPerfil} alt="Mi perfil" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {currentUser.nombre?.charAt(0) || 'E'}
          </div>
        )}
        <textarea 
          placeholder="¿Qué has encadenado hoy?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={submitting}
        />
      </div>

      {preview && (
        <div className={styles.previewContainer}>
          <button type="button" className={styles.removeMediaBtn} onClick={clearFile} disabled={submitting}>
            <X size={16} />
          </button>
          {preview.type === 'image' ? (
            <img src={preview.url} alt="Previsualización" className={styles.mediaPreview} />
          ) : (
            <video src={preview.url} className={styles.mediaPreview} controls />
          )}
        </div>
      )}

      {submitting && progress > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className={styles.actions}>
        <div className={styles.mediaButtons}>
          <label className={`${styles.iconBtn} ${submitting ? styles.disabled : ''}`}>
            <ImageIcon size={20} />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              disabled={submitting} 
              hidden 
            />
          </label>
          <label className={`${styles.iconBtn} ${submitting ? styles.disabled : ''}`}>
            <Video size={20} />
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              disabled={submitting} 
              hidden 
            />
          </label>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={submitting || (!texto.trim() && !file)}
          className={styles.submitBtn}
        >
          {submitting ? 'Publicando...' : <><Send size={16} /> Publicar</>}
        </Button>
      </div>
    </form>
  );
}