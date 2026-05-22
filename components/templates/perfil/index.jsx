'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Settings, MapPin, Activity, Award, Calendar, Share2, TrendingUp, Users, UserPlus, UserCheck, Clock, Lock, Globe, MessageSquare, ShieldAlert, LogIn } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import { useFriendship } from '@/hooks/useFriendship';
import styles from './perfil.module.scss';

export default function PerfilTemplate({ profile, logbook, currentUserId, currentUserRole }) {
  const [activeTab, setActiveTab] = useState('actividad');

  if (!currentUserId) {
    return (
      <Container className={styles.container}>
        <div className={styles.guestCard}>
          <div className={styles.guestIcon}>
            <Lock size={48} />
          </div>
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión en Vertical Hub para explorar los perfiles de la comunidad, comprobar estadísticas y conectar con otros escaladores.</p>
          <div className={styles.guestActions}>
            <Link href="/login" passHref>
              <Button variant="primary" className={styles.guestBtn}>
                <LogIn size={18} />
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button variant="outline" className={styles.guestBtn}>
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (!profile) return null;

  const isOwnProfile = currentUserId === profile.id;
  const isAdminView = currentUserRole === 'admin' && !isOwnProfile;

  const { relation, loading: loadingFriendship, handleAction } = useFriendship(
    currentUserId,
    profile.id,
    profile.esPrivado
  );

  const stats = profile.stats || {
    totalAscensiones: 0,
    gradoMaximo: profile.nivelEscalada || '-',
    amigos: 0
  };

  const regYear = profile.fechaRegistro?.toDate 
    ? profile.fechaRegistro.toDate().getFullYear() 
    : new Date().getFullYear();

  const idCombo = [currentUserId, profile.id].sort().join('_');

  const renderHeaderActions = () => {
    if (isOwnProfile) {
      return (
        <Button variant="primary" className={styles.actionBtn}>
          <Settings size={18} />
          Editar Perfil
        </Button>
      );
    }

    if (isAdminView) {
      return (
        <div className={styles.adminActionsBlock}>
          <Button variant="outline" className={`${styles.actionBtn} ${styles.btnAdmin}`}>
            <ShieldAlert size={18} />
            Moderar Perfil
          </Button>
          <Link href={`/mensajes/${idCombo}`} passHref>
            <Button variant="primary" className={styles.actionBtn}>
              <MessageSquare size={18} />
              Chat Privado
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className={styles.userActionsBlock}>
        {!loadingFriendship && (
          <>
            {!relation && (
              <Button variant="primary" className={styles.actionBtn} onClick={handleAction}>
                <UserPlus size={18} />
                {profile.esPrivado ? 'Enviar solicitud' : 'Añadir amigo'}
              </Button>
            )}
            {relation && relation.estado === 'pendiente' && (
              <Button variant="outline" className={styles.actionBtn} onClick={handleAction}>
                <Clock size={18} />
                {relation.remitenteId === currentUserId ? 'Solicitud enviada' : 'Aceptar Solicitud'}
              </Button>
            )}
            {relation && relation.estado === 'aceptados' && (
              <Button variant="outline" className={styles.actionBtn} onClick={handleAction}>
                <UserCheck size={18} />
                Amigos
              </Button>
            )}
          </>
        )}
        <Link href={`/mensajes/${idCombo}`} passHref>
          <Button variant="outline" className={styles.iconBtn}>
            <MessageSquare size={18} />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <Container className={styles.container}>
      <div className={styles.coverPhoto}>
        {isAdminView && <div className={styles.adminRibbon}>Modo Administrador</div>}
        <div className={styles.coverGradient}></div>
      </div>

      <div className={styles.profileCard}>
        <header className={styles.header}>
          <div className={styles.avatarWrapper}>
            {profile.fotoPerfil ? (
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
            {renderHeaderActions()}
          </div>
        </header>

        <div className={styles.infoSection}>
          <div className={styles.nameHeader}>
            <h1 className={styles.name}>{profile.nombre}</h1>
            <span className={styles.username}>@{profile.email.split('@')[0]}</span>
          </div>
          
          <div className={styles.badges}>
            <span className={`${styles.badge} ${profile.esPrivado ? styles.private : styles.public}`}>
              {profile.esPrivado ? <Lock size={14} /> : <Globe size={14} />}
              {profile.esPrivado ? 'Privado' : 'Público'}
            </span>
            <span className={styles.badge}>
              <Activity size={14} />
              {profile.nivelEscalada || 'Sin nivel'}
            </span>
            <span className={styles.badge}>
              <MapPin size={14} />
              Burgos
            </span>
            <span className={styles.badge}>
              <Calendar size={14} />
              Miembro desde {regYear}
            </span>
          </div>

          <p className={styles.bio}>{profile.bio || 'Este usuario aún no ha escrito una biografía.'}</p>
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

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'actividad' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('actividad')}
          >
            <TrendingUp size={18} />
            Actividad Reciente
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'logbook' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('logbook')}
          >
            <Award size={18} />
            Logbook ({logbook.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'amigos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('amigos')}
          >
            <Users size={18} />
            Amigos
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'actividad' && (
            <div className={styles.activityList}>
              {logbook.length === 0 ? (
                <div className={styles.emptyState}>No hay actividad reciente.</div>
              ) : (
                logbook.map(log => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Award size={20} />
                    </div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityHeader}>
                        <h4>{log.via}</h4>
                        <span className={styles.gradeBadge}>{log.grado}</span>
                      </div>
                      <div className={styles.activityMeta}>
                        <span>{log.rocodromo}</span>
                        <span>•</span>
                        <span>{log.tipo}</span>
                        <span>•</span>
                        <span>{log.fechaFormateada}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'logbook' && (
            <div className={styles.emptyState}>
              <p>Estadísticas detalladas de tus {stats.totalAscensiones} ascensiones.</p>
            </div>
          )}

          {activeTab === 'amigos' && (
            <div className={styles.emptyState}>
              <p>Tienes {stats.amigos} amigos en tu red.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}