'use client';

import { useState } from 'react';
import { User, Settings, MapPin, Activity, Award, Calendar, Share2, TrendingUp, Users, Lock, Globe, Camera, Hash, Building2 } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import Modal from '@/components/_base/ui/modal';
import styles from '../perfil.module.scss';

export default function OwnProfileView({ profile, logbook, onUpdateProfile }) {
  const [activeTab, setActiveTab] = useState('actividad');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    bio: profile?.bio || '',
    nivelEscalada: profile?.nivelEscalada || '',
    fotoPerfil: profile?.fotoPerfil || '',
    ubicacion: profile?.ubicacion || '',
    modalidadFavorita: profile?.modalidadFavorita || 'boulder',
    rocodromoHabitual: profile?.rocodromoHabitual || '',
    esPrivado: profile?.esPrivado || false
  });

  const [submitting, setSubmitting] = useState(false);

  const stats = profile?.stats || { totalAscensiones: 0, gradoMaximo: profile?.nivelEscalada || '-', amigos: 0 };
  const regYear = profile?.fechaRegistro?.toDate ? profile.fechaRegistro.toDate().getFullYear() : new Date().getFullYear();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    await onUpdateProfile(formData);
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.coverPhoto}>
        <div className={styles.coverGradient}></div>
      </div>

      <div className={styles.profileCard}>
        <header className={styles.header}>
          <div className={styles.avatarWrapper}>
            {profile?.fotoPerfil ? (
              <img src={profile.fotoPerfil} alt={profile.nombre} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={56} strokeWidth={1.5} />
              </div>
            )}
          </div>
          
          <div className={styles.actionButtons}>
            <Button variant="outline" className={styles.iconBtn}>
              <Share2 size={18} />
            </Button>
            <Button variant="primary" className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
              <Settings size={18} />
              Editar Perfil
            </Button>
          </div>
        </header>

        <div className={styles.infoSection}>
          <div className={styles.nameHeader}>
            <h1 className={styles.name}>{profile?.nombre}</h1>
            <span className={styles.username}>@{profile?.email?.split('@')[0]}</span>
          </div>
          
          <div className={styles.badges}>
            <span className={`${styles.badge} ${profile?.esPrivado ? styles.private : styles.public}`}>
              {profile?.esPrivado ? <Lock size={14} /> : <Globe size={14} />}
              {profile?.esPrivado ? 'Privado' : 'Público'}
            </span>
            <span className={styles.badge}>
              <Activity size={14} />
              {profile?.nivelEscalada || 'Sin nivel'}
            </span>
            <span className={styles.badge}>
              <MapPin size={14} />
              {profile?.ubicacion || 'Sin ubicación'}
            </span>
            <span className={styles.badge}>
              <Calendar size={14} />
              Miembro desde {regYear}
            </span>
          </div>

          <p className={styles.bio}>{profile?.bio || 'Este usuario aún no ha escrito una biografía.'}</p>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{stats.totalAscensiones}</span>
            <span className={styles.statLabel}>Ascensiones</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{stats.gradoMaximo}</span>
            <span className={styles.statLabel}>Grado Máx</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{stats.amigos}</span>
            <span className={styles.statLabel}>Amigos</span>
          </div>
        </div>
      </div>

      {/* Tabs y contenido de actividad... (Se mantiene igual que el anterior) */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'actividad' ? styles.activeTab : ''}`} onClick={() => setActiveTab('actividad')}>
            <TrendingUp size={18} /> Actividad
          </button>
          <button className={`${styles.tab} ${activeTab === 'logbook' ? styles.activeTab : ''}`} onClick={() => setActiveTab('logbook')}>
            <Award size={18} /> Logbook
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === 'actividad' && (
             <div className={styles.activityList}>
                {logbook.length === 0 ? <div className={styles.emptyState}>No hay actividad.</div> : 
                logbook.map(log => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}><Award size={20} /></div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityHeader}><h4>{log.via}</h4><span className={styles.gradeBadge}>{log.grado}</span></div>
                      <div className={styles.activityMeta}><span>{log.rocodromo}</span> • <span>{log.fechaFormateada}</span></div>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Editar Perfil">
        <div className={styles.editForm}>
          
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label><User size={14} /> Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>
            <div className={styles.inputGroup}>
              <label><Camera size={14} /> URL Foto</label>
              <input type="text" name="fotoPerfil" value={formData.fotoPerfil} onChange={handleInputChange} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label><MapPin size={14} /> Ubicación</label>
              <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} placeholder="Ej: Burgos, España" />
            </div>
            <div className={styles.inputGroup}>
              <label><Activity size={14} /> Grado Actual</label>
              <select name="nivelEscalada" value={formData.nivelEscalada} onChange={handleInputChange}>
                <option value="">Selecciona...</option>
                <option value="6a">6a</option><option value="6b">6b</option><option value="6c">6c</option>
                <option value="7a">7a</option><option value="7b">7b</option><option value="7c">7c</option>
                <option value="8a">8a</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label><Hash size={14} /> Modalidad Favorita</label>
              <select name="modalidadFavorita" value={formData.modalidadFavorita} onChange={handleInputChange}>
                <option value="boulder">Boulder</option>
                <option value="vias">Vías (Cuerda)</option>
                <option value="velocidad">Velocidad</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label><Building2 size={14} /> Rocódromo Habitual</label>
              <input type="text" name="rocodromoHabitual" value={formData.rocodromoHabitual} onChange={handleInputChange} placeholder="Ej: Skala" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Biografía</label>
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} placeholder="Cuéntanos algo sobre tu escalada..." />
          </div>

          <div className={styles.privacyToggle}>
            <div className={styles.toggleText}>
              <span className={styles.toggleTitle}>Perfil Privado</span>
              <span className={styles.toggleDesc}>Solo tus amigos podrán ver tu logbook y estadísticas.</span>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" name="esPrivado" checked={formData.esPrivado} onChange={handleInputChange} />
              <span className={styles.slider}></span>
            </label>
          </div>

          <Button variant="primary" onClick={handleSave} disabled={submitting} style={{ width: '100%', marginTop: '12px' }}>
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </Modal>
    </Container>
  );
}