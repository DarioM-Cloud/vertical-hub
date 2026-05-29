'use client';

import { useState } from 'react';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Button from '@/components/_base/ui/button';
import Loader from '@/components/_base/ui/loader';
import PartnerTicket from '@/components/_base/cards/partnerTicket';
import Modal from '@/components/_base/ui/modal';
import styles from './partnerCheck.module.scss';

export default function PartnerCheckTemplate({ solicitudes = [], loading, currentUser, rocodromos = [], onAddTicket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    rocodromoId: '',
    nivel: '',
    franja: '',
    modalidad: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !formData.rocodromoId) return;
    
    setSubmitting(true);
    const selectedRoco = rocodromos.find(r => r.id === formData.rocodromoId);
    
    await onAddTicket(
      currentUser, 
      formData.rocodromoId, 
      selectedRoco?.nombre || 'Rocódromo', 
      formData.nivel,
      formData.franja,
      formData.modalidad,
      formData.mensaje
    );
    
    setSubmitting(false);
    setIsModalOpen(false);
    setFormData({ rocodromoId: '', nivel: '', franja: '', modalidad: '', mensaje: '' });
  };

  return (
    <Container className={styles.container}>
      <Section className={styles.header}>
        <div className={styles.titleWrapper}>
          <Heading level={1}>Partner Check</Heading>
          <Text variant="muted">Encuentra compañero de cordada para tu próxima sesión.</Text>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Crear Anuncio</Button>
      </Section>

      <Section>
        {loading ? (
          <Loader text="Buscando escaladores..." />
        ) : solicitudes.length > 0 ? (
          <div className={styles.grid}>
            {solicitudes.map((solicitud) => (
              <PartnerTicket key={solicitud.id} {...solicitud} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className={styles.empty}>
            No hay anuncios activos. ¡Sé el primero en crear uno!
          </Text>
        )}
      </Section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Anuncio">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Rocódromo</label>
            <select name="rocodromoId" value={formData.rocodromoId} onChange={handleInputChange} required>
              <option value="">Selecciona un rocódromo...</option>
              {rocodromos.map(roco => (
                <option key={roco.id} value={roco.id}>{roco.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Nivel</label>
              <select name="nivel" value={formData.nivel} onChange={handleInputChange} required>
                <option value="">Selecciona...</option>
                <option value="Iniciación (V - 6a)">Iniciación (V - 6a)</option>
                <option value="Intermedio (6a+ - 6c+)">Intermedio (6a+ - 6c+)</option>
                <option value="Avanzado (7a - 7c+)">Avanzado (7a - 7c+)</option>
                <option value="Experto (8a o más)">Experto (8a o más)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Modalidad</label>
              <select name="modalidad" value={formData.modalidad} onChange={handleInputChange} required>
                <option value="">Selecciona...</option>
                <option value="Boulder">Boulder</option>
                <option value="Vías (Cuerda)">Vías (Cuerda)</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Franja Horaria (2-3 horas)</label>
            <select name="franja" value={formData.franja} onChange={handleInputChange} required>
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
              name="mensaje" 
              value={formData.mensaje} 
              onChange={handleInputChange}
              placeholder="Ej: Llevo cuerda de 70m y grigri..."
              rows={3}
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} className={styles.submitBtn}>
            {submitting ? 'Publicando...' : 'Publicar Anuncio'}
          </Button>
        </form>
      </Modal>
    </Container>
  );
}