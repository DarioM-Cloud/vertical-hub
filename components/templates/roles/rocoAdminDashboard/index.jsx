'use client';

import { useState } from 'react';
import { Plus, Minus, Trash2, Megaphone, Activity, EyeOff, Save, Users, Layers } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './rocoAdminDashboard.module.scss';

export default function RocoAdminDashboardTemplate({ 
  currentUserProfile,
  gymData, 
  announcements = [], 
  routes = [], 
  localPosts = [], 
  onUpdateOccupancy, 
  onAddAnnouncement, 
  onDeleteAnnouncement,
  onUpdateRoute,
  onRemovePostFromGym 
}) {
  const [activeTab, setActiveTab] = useState('aforo');
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: '', contenido: '' });
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeForm, setRouteForm] = useState({ nombre: '', grado: '', estado: '' });

  const gymName = gymData?.nombre || 'Panel de Administración';
  const currentOccupancy = gymData?.ocupacionActual || 0;
  const maxCapacity = gymData?.aforoMaximo || 100;

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!nuevoAnuncio.titulo || !nuevoAnuncio.contenido) return;
    onAddAnnouncement(nuevoAnuncio);
    setNuevoAnuncio({ titulo: '', contenido: '' });
  };

  const startEditingRoute = (via) => {
    setEditingRouteId(via.id);
    setRouteForm({ nombre: via.nombre, grado: via.grado, estado: via.estado });
  };

  const handleSaveRoute = (id) => {
    onUpdateRoute(id, routeForm);
    setEditingRouteId(null);
  };

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <header className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.title}>Gestión Interna: {gymName}</h1>
            <p className={styles.subtitle}>
              Sesión administrativa activa para la terminal del rocódromo con ID: {currentUserProfile?.adminRocoId}
            </p>
          </div>
        </header>

        <div className={styles.rocoDashboard}>
          <div className={styles.tabsContainer}>
            <button className={`${styles.tab} ${activeTab === 'aforo' ? styles.activeTab : ''}`} onClick={() => setActiveTab('aforo')}>
              <Users size={16} /> Aforo y Control
            </button>
            <button className={`${styles.tab} ${activeTab === 'anuncios' ? styles.activeTab : ''}`} onClick={() => setActiveTab('anuncios')}>
              <Megaphone size={16} /> Anuncios
            </button>
            <button className={`${styles.tab} ${activeTab === 'vias' ? styles.activeTab : ''}`} onClick={() => setActiveTab('vias')}>
              <Layers size={16} /> Vías
            </button>
            <button className={`${styles.tab} ${activeTab === 'comunidad' ? styles.activeTab : ''}`} onClick={() => setActiveTab('comunidad')}>
              <Activity size={16} /> Comunidad Local
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'aforo' && (
              <div className={styles.card} style={{ maxWidth: '500px', margin: '0px auto' }}>
                <h2 className={styles.cardTitle}>Control de Acceso (Tornos simulados)</h2>
                <div className={styles.occupancyCounter}>
                  <span className={styles.counterNumber}>{currentOccupancy}</span>
                  <span className={styles.counterMax}>de {maxCapacity} personas máximo</span>
                </div>
                <div className={styles.counterControls}>
                  <button 
                    className={styles.counterBtn} 
                    onClick={() => onUpdateOccupancy(Math.max(0, currentOccupancy - 1))}
                    disabled={currentOccupancy <= 0}
                  >
                    <Minus size={24} />
                  </button>
                  <button 
                    className={styles.counterBtn} 
                    onClick={() => onUpdateOccupancy(Math.min(maxCapacity, currentOccupancy + 1))}
                    disabled={currentOccupancy >= maxCapacity}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'anuncios' && (
              <div className={styles.sectionGrid}>
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Publicar en el Tablón</h2>
                  <form onSubmit={handleAnnouncementSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label>Título del Anuncio</label>
                      <input
                        type="text"
                        value={nuevoAnuncio.titulo}
                        onChange={(e) => setNuevoAnuncio({ ...nuevoAnuncio, titulo: e.target.value })}
                        placeholder="Ej: Mañana cerramos por mantenimiento técnico"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Contenido del Mensaje</label>
                      <textarea
                        value={nuevoAnuncio.contenido}
                        onChange={(e) => setNuevoAnuncio({ ...nuevoAnuncio, contenido: e.target.value })}
                        rows={4}
                        placeholder="Escribe los detalles aquí..."
                      />
                    </div>
                    <Button type="submit" variant="primary" style={{ width: '100%' }}>
                      Publicar Anuncio
                    </Button>
                  </form>
                </div>

                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Anuncios Activos</h2>
                  <div className={styles.listArea}>
                    {announcements.length === 0 ? (
                      <p className={styles.emptyText}>No hay anuncios publicados en este centro.</p>
                    ) : (
                      announcements.map((item) => (
                        <div key={item.id} className={styles.listItem}>
                          <div style={{ flex: 1, paddingRight: '12px' }}>
                            <span className={styles.itemMainText}>{item.titulo}</span>
                            <p className={styles.itemSubText} style={{ whiteSpace: 'normal', marginTop: '4px' }}>{item.contenido}</p>
                          </div>
                          <button className={styles.deleteBtn} onClick={() => onDeleteAnnouncement(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vias' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Planificación de Vías y Bloques</h2>
                <div className={styles.routesTableContainer}>
                  <table className={styles.routesTable}>
                    <thead>
                      <tr>
                        <th>Nombre de la Vía</th>
                        <th>Grado</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((via) => (
                        <tr key={via.id}>
                          <td>
                            {editingRouteId === via.id ? (
                              <input 
                                type="text" 
                                value={routeForm.nombre} 
                                onChange={(e) => setRouteForm({ ...routeForm, nombre: e.target.value })}
                                className={styles.tableInput}
                              />
                            ) : (
                              via.nombre
                            )}
                          </td>
                          <td>
                            {editingRouteId === via.id ? (
                              <select 
                                value={routeForm.grado} 
                                onChange={(e) => setRouteForm({ ...routeForm, grado: e.target.value })}
                                className={styles.tableSelect}
                              >
                                <option value="6a">6a</option><option value="6b">6b</option><option value="6c">6c</option>
                                <option value="7a">7a</option><option value="7b">7b</option><option value="7c">7c</option>
                                <option value="8a">8a</option>
                              </select>
                            ) : (
                              <span className={styles.tableGradeBadge}>{via.grado}</span>
                            )}
                          </td>
                          <td>
                            {editingRouteId === via.id ? (
                              <select 
                                value={routeForm.estado} 
                                onChange={(e) => setRouteForm({ ...routeForm, estado: e.target.value })}
                                className={styles.tableSelect}
                              >
                                <option value="Abierta">Abierta</option>
                                <option value="Proyecto">Proyecto</option>
                                <option value="Desequipada">Desequipada</option>
                              </select>
                            ) : (
                              <span className={`${styles.statusBadge} ${styles[via.estado?.toLowerCase()]}`}>
                                {via.estado}
                              </span>
                            )}
                          </td>
                          <td>
                            {editingRouteId === via.id ? (
                              <button className={styles.saveRouteBtn} onClick={() => handleSaveRoute(via.id)}>
                                <Save size={16} />
                              </button>
                            ) : (
                              <button className={styles.editRouteBtn} onClick={() => startEditingRoute(via)}>
                                Modificar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'comunidad' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Moderación del Tablón Local</h2>
                <div className={styles.postsGrid}>
                  {localPosts.length === 0 ? (
                    <p className={styles.emptyText}>No hay publicaciones indexadas en la comunidad de este rocódromo.</p>
                  ) : (
                    localPosts.map((post) => (
                      <div key={post.id} className={styles.postItem}>
                        {post.mediaUrl && (
                          <div className={styles.postImageContainer}>
                            <img src={post.mediaUrl} alt="Post de usuario" />
                          </div>
                        )}
                        <div className={styles.postDetails}>
                          <span className={styles.postAuthor}>@{post.autorNombre || 'Usuario'}</span>
                          <p className={styles.postText}>{post.texto}</p>
                          <button className={styles.hidePostBtn} onClick={() => onRemovePostFromGym(post.id)}>
                            <EyeOff size={14} /> Quitar del Muro del Rocódromo
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}