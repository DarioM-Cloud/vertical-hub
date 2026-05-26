'use client';

import { useState, useRef } from 'react';
import { MessageSquare, Users, Image as ImageIcon, Video, X } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import Modal from '@/components/_base/ui/modal';
import PostCard from '@/components/_base/cards/postCard';
import PartnerTicket from '@/components/_base/cards/partnerTicket';
import styles from './comunidad.module.scss';

export default function ComunidadTemplate({ 
  posts, tickets, rocodromos, currentUser, 
  onAddPost, uploadProgress, onAddTicket, onDeleteTicket, onToggleJoin 
}) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  
  const [postText, setPostText] = useState('');
  const [postRocoId, setPostRocoId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [partnerText, setPartnerText] = useState('');
  const [selectedTicketRocoId, setSelectedTicketRocoId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview({
      url: URL.createObjectURL(selected),
      type: selected.type.startsWith('video/') ? 'video' : 'image'
    });
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublishPost = async () => {
    if (!currentUser) return alert('Debes iniciar sesión');
    setSubmitting(true);
    
    const rocoData = rocodromos.find(r => r.id === postRocoId) || {};
    
    await onAddPost(currentUser, postText, postRocoId, rocoData.nombre, file);
    
    setPostText('');
    setPostRocoId('');
    clearFile();
    setSubmitting(false);
    setIsPostModalOpen(false);
  };

  const handlePublishTicket = async () => {
    if (!currentUser) return alert('Debes iniciar sesión');
    if (!selectedTicketRocoId) return alert('Selecciona un rocódromo');
    const rocoData = rocodromos.find(r => r.id === selectedTicketRocoId);
    
    setSubmitting(true);
    await onAddTicket(currentUser, selectedTicketRocoId, rocoData.nombre, partnerText);
    setPartnerText('');
    setSelectedTicketRocoId('');
    setSubmitting(false);
    setIsPartnerModalOpen(false);
  };

  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Comunidad</h1>
        </div>
        
        <div className={styles.actions}>
          <Button variant="primary" className={styles.actionBtn} onClick={() => setIsPostModalOpen(true)}>
            <MessageSquare size={18} />
            Publicar
          </Button>
          <Button variant="outline" className={styles.actionBtn} onClick={() => setIsPartnerModalOpen(true)}>
            <Users size={18} />
            Buscar Compañero
          </Button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <div className={styles.columnHeader}>
            <h2>Feed Social</h2>
          </div>
          <div className={styles.feedList}>
            {posts.length === 0 ? (
              <div className={styles.empty}>El feed está tranquilo. ¡Sé el primero en compartir algo!</div>
            ) : (
              posts.map(post => <PostCard key={post.id} data={post} />)
            )}
          </div>
        </div>

        <div className={styles.sideColumn}>
          <div className={styles.columnHeader}>
            <h2>Tablón de Compañeros</h2>
          </div>
          <div className={styles.ticketList}>
            {tickets.length === 0 ? (
              <div className={styles.empty}>Nadie busca compañero ahora mismo.</div>
            ) : (
              tickets.map(ticket => <PartnerTicket key={ticket.id} data={ticket} />)
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Nueva Publicación">
        <div className={styles.modalForm}>
          <select 
            className={styles.selectInput}
            value={postRocoId}
            onChange={(e) => setPostRocoId(e.target.value)}
          >
            <option value="">Etiquetar Rocódromo...</option>
            {rocodromos.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>

          <textarea 
            className={styles.textarea} 
            placeholder="¿Qué has encadenado hoy?" 
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={4}
          />

          {preview && (
            <div className={styles.previewContainer}>
              <button type="button" className={styles.removeMediaBtn} onClick={clearFile}>
                <X size={16} />
              </button>
              {preview.type === 'image' ? (
                <img src={preview.url} alt="Previsualización" className={styles.mediaPreview} />
              ) : (
                <video src={preview.url} className={styles.mediaPreview} controls />
              )}
            </div>
          )}

          {submitting && uploadProgress > 0 && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}

          <div className={styles.mediaButtons}>
            <label className={styles.iconBtn}>
              <ImageIcon size={20} />
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} hidden />
            </label>
            <label className={styles.iconBtn}>
              <Video size={20} />
              <input type="file" accept="video/*" onChange={handleFileChange} hidden />
            </label>
          </div>

          <Button 
            variant="primary" 
            style={{ width: '100%' }}
            onClick={handlePublishPost}
            disabled={(!postText.trim() && !file) || submitting}
          >
            {submitting ? 'Subiendo...' : 'Publicar en el Feed'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} title="Buscar Compañero">
        <div className={styles.modalForm}>
          <select 
            className={styles.selectInput}
            value={selectedTicketRocoId}
            onChange={(e) => setSelectedTicketRocoId(e.target.value)}
          >
            <option value="">Selecciona un rocódromo...</option>
            {rocodromos.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
          <textarea 
            className={styles.textarea} 
            placeholder="Escribe tu nivel, disponibilidad, qué modalidad quieres practicar..." 
            value={partnerText}
            onChange={(e) => setPartnerText(e.target.value)}
            rows={4}
          />
          <Button 
            variant="primary" 
            style={{ width: '100%' }}
            onClick={handlePublishTicket}
            disabled={!partnerText.trim() || !selectedTicketRocoId || submitting}
          >
            {submitting ? 'Publicando...' : 'Fijar en el Tablón'}
          </Button>
        </div>
      </Modal>
    </Container>
  );
}