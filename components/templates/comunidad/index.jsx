'use client';

import { useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import Modal from '@/components/_base/ui/modal';
import PostCard from '@/components/_base/cards/postCard';
import PartnerTicket from '@/components/_base/cards/partnerTicket';
import styles from './comunidad.module.scss';

export default function ComunidadTemplate({ 
  posts, tickets, rocodromos, currentUser, 
  onAddPost, onAddTicket, onDeleteTicket, onToggleJoin 
}) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [partnerText, setPartnerText] = useState('');
  const [selectedRocoId, setSelectedRocoId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePublishPost = async () => {
    if (!currentUser) return alert('Debes iniciar sesión');
    setSubmitting(true);
    await onAddPost(currentUser, postText);
    setPostText('');
    setSubmitting(false);
    setIsPostModalOpen(false);
  };

  const handlePublishTicket = async () => {
    if (!currentUser) return alert('Debes iniciar sesión');
    if (!selectedRocoId) return alert('Selecciona un rocódromo');
    const rocoData = rocodromos.find(r => r.id === selectedRocoId);
    
    setSubmitting(true);
    await onAddTicket(currentUser, selectedRocoId, rocoData.nombre, partnerText);
    setPartnerText('');
    setSelectedRocoId('');
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
        <textarea 
          className={styles.textarea} 
          placeholder="¿Qué estás pensando?" 
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={4}
        />
        <Button 
          variant="primary" 
          style={{ width: '100%', marginTop: '16px' }}
          onClick={handlePublishPost}
          disabled={!postText.trim() || submitting}
        >
          {submitting ? 'Publicando...' : 'Publicar en el Feed'}
        </Button>
      </Modal>

      <Modal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} title="Buscar Compañero">
        <select 
          className={styles.selectInput}
          value={selectedRocoId}
          onChange={(e) => setSelectedRocoId(e.target.value)}
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
          style={{ marginTop: '16px' }}
        />
        <Button 
          variant="primary" 
          style={{ width: '100%', marginTop: '16px' }}
          onClick={handlePublishTicket}
          disabled={!partnerText.trim() || !selectedRocoId || submitting}
        >
          {submitting ? 'Publicando...' : 'Fijar en el Tablón'}
        </Button>
      </Modal>
    </Container>
  );
}