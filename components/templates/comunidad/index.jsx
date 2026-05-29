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

  const [partnerData, setPartnerData] = useState({
    rocodromoId: '',
    nivel: '',
    franja: '',
    modalidad: '',
    mensaje: ''
  });
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

  const handlePartnerInputChange = (e) => {
    const { name, value } = e.target;
    setPartnerData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublishTicket = async () => {
    if (!currentUser) return alert('Debes iniciar sesión');
    if (!partnerData.rocodromoId) return alert('Selecciona un rocódromo');
    
    const rocoData = rocodromos.find(r => r.id === partnerData.rocodromoId);
    
    setSubmitting(true);
    await onAddTicket(
      currentUser, 
      partnerData.rocodromoId, 
      rocoData.nombre, 
      partnerData.nivel,
      partnerData.franja,
      partnerData.modalidad,
      partnerData.mensaje
    );
    
    setPartnerData({ rocodromoId: '', nivel: '', franja: '', modalidad: '', mensaje: '' });
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
          <div className={styles.formGroup}>
            <label>Rocódromo</label>
            <select 
              className={styles.selectInput}
              name="rocodromoId"
              value={partnerData.rocodromoId}
              onChange={handlePartnerInputChange}
            >
              <option value="">Selecciona un rocódromo...</option>
              {rocodromos.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Nivel</label>
              <select className={styles.selectInput} name="nivel" value={partnerData.nivel} onChange={handlePartnerInputChange}>
                <option value="">Selecciona...</option>
                <option value="Iniciación (V - 6a)">Iniciación (V - 6a)</option>
                <option value="Intermedio (6a+ - 6c+)">Intermedio (6a+ - 6c+)</option>
                <option value="Avanzado (7a - 7c+)">Avanzado (7a - 7c+)</option>
                <option value="Experto (8a o más)">Experto (8a o más)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Modalidad</label>
              <select className={styles.selectInput} name="modalidad" value={partnerData.modalidad} onChange={handlePartnerInputChange}>
                <option value="">Selecciona...</option>
                <option value="Boulder">Boulder</option>
                <option value="Vías (Cuerda)">Vías (Cuerda)</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Franja Horaria (2-3 horas)</label>
            <select className={styles.selectInput} name="franja" value={partnerData.franja} onChange={handlePartnerInputChange}>
              <option value="">Selecciona...</option>
              <option value="Mañana (10:00 - 13:00)">Mañana (10:00 - 13:00)</option>
              <option value="Mediodía (13:00 - 16:00)">Mediodía (13:00 - 16:00)</option>
              <option value="Tarde (16:00 - 19:00)">Tarde (16:00 - 19:00)</option>
              <option value="Noche (19:00 - 22:00)">Noche (19:00 - 22:00)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Mensaje adicional (Opcional)</label>
            <textarea 
              className={styles.textarea} 
              name="mensaje"
              placeholder="Ej: Llevo cuerda de 70m y grigri..." 
              value={partnerData.mensaje}
              onChange={handlePartnerInputChange}
              rows={3}
            />
          </div>

          <Button 
            variant="primary" 
            style={{ width: '100%', marginTop: '8px' }}
            onClick={handlePublishTicket}
            disabled={!partnerData.rocodromoId || !partnerData.nivel || !partnerData.modalidad || !partnerData.franja || submitting}
          >
            {submitting ? 'Publicando...' : 'Fijar en el Tablón'}
          </Button>
        </div>
      </Modal>
    </Container>
  );
}