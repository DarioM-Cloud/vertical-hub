'use client';

import { useState } from 'react';
import { User, MapPin, Activity, Award, Calendar, Share2, TrendingUp, Lock, Globe, Hash, Trash2, ShieldAlert } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from '../perfil.module.scss';

export default function AdminProfileView({ profile, logbook = [], posts = [], onDeletePost }) {
  const [activeTab, setActiveTab] = useState('actividad');

  const stats = profile?.stats || { totalAscensiones: logbook.length, gradoMaximo: profile?.nivelEscalada || '-', amigos: 0 };
  const regYear = profile?.fechaRegistro?.toDate ? profile.fechaRegistro.toDate().getFullYear() : new Date().getFullYear();

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
            <Button variant="outline" className={styles.actionBtn} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <ShieldAlert size={18} />
              Suspender Usuario
            </Button>
          </div>
        </header>

        <div className={styles.infoSection}>
          <div className={styles.nameHeader}>
            <h1 className={styles.name}>{profile?.nombre || 'Atleta'}</h1>
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
            <span className={styles.statNumber}>{logbook.length}</span>
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
                {logbook.length === 0 ? <div className={styles.emptyState}>No hay actividad reciente.</div> : 
                logbook.map(log => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}><Award size={20} /></div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityHeader}><h4>{log.via}</h4><span className={styles.gradeBadge}>{log.grado}</span></div>
                      <div className={styles.activityMeta}><span>{log.rocodromo}</span> • <span>{log.tipo}</span></div>
                    </div>
                  </div>
                ))}
             </div>
          )}
          {activeTab === 'logbook' && (
             <div className={styles.activityList}>
                {logbook.length === 0 ? <div className={styles.emptyState}>El historial de encadenes está vacío.</div> : 
                logbook.map(log => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}><Hash size={20} /></div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityHeader}><h4>{log.via} ({log.rocodromo})</h4><span className={styles.gradeBadge}>{log.grado}</span></div>
                      <div className={styles.activityMeta}><span>Estilo: {log.tipo}</span> {log.intentos && <span>• Intentos: {log.intentos}</span>}</div>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      <div className={styles.postsSection}>
        <div className={styles.sectionHeader}>
          <h2>Publicaciones (Vista Moderador)</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className={styles.emptyState}>No ha compartido ninguna publicación todavía.</div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map(post => (
              <div key={post.id} className={styles.profilePostCard}>
                <button className={styles.deletePostBtn} onClick={() => onDeletePost(post.id)}>
                  <Trash2 size={16} />
                </button>
                
                {post.mediaUrl && (
                  <div className={styles.postMediaWrapper}>
                    {post.mediaType === 'video' ? (
                      <video src={post.mediaUrl} controls className={styles.postMedia} />
                    ) : (
                      <img src={post.mediaUrl} alt="Publicación" className={styles.postMedia} />
                    )}
                  </div>
                )}
                
                <div className={styles.postContentWrapper}>
                  {post.rocodromoNombre && (
                    <span className={styles.rocoBadge}>
                      <MapPin size={12} />
                      {post.rocodromoNombre}
                    </span>
                  )}
                  <p className={styles.postText}>{post.texto}</p>
                  <span className={styles.postDate}>
                    {post.fecha?.toDate ? new Intl.DateTimeFormat('es-ES').format(post.fecha.toDate()) : 'Reciente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}