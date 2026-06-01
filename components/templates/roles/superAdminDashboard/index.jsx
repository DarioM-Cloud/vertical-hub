'use client';

import { useState } from 'react';
import { Plus, Trash2, MapPin, Search, Users, Image as ImageIcon, ShieldAlert, Lock, Unlock, Save, X } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './superAdminDashboard.module.scss';

export default function SuperAdminDashboardTemplate({
  rocodromos = [],
  usuarios = [],
  fotos = [],
  onAddRocodromo,
  onDeleteRocodromo,
  onUpdateUserRole,
  onToggleBlockUser,
  onUpdatePhoto
}) {
  const [activeTab, setActiveTab] = useState('rocodromos');
  const [searchRoco, setSearchRoco] = useState('');
  const [searchUser, setSearchUser] = useState('');
  
  const [nuevoRoco, setNuevoRoco] = useState({
    nombre: '', ubicacion: '', latitud: '', longitud: '', aforoMaximo: 100, imagenUrl: ''
  });

  const [editUrls, setEditUrls] = useState({});
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, roco: null });
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!nuevoRoco.nombre || !nuevoRoco.ubicacion) return;
    onAddRocodromo(nuevoRoco);
    setNuevoRoco({ nombre: '', ubicacion: '', latitud: '', longitud: '', aforoMaximo: 100, imagenUrl: '' });
  };

  const handlePhotoUrlChange = (uid, val) => {
    setEditUrls(prev => ({ ...prev, [uid]: val }));
  };

  const savePhotoUrl = (foto) => {
    const nuevaUrl = editUrls[foto.uid];
    if (nuevaUrl !== undefined) {
      onUpdatePhoto(foto.coleccion, foto.id, foto.campo, nuevaUrl);
    }
  };

  const confirmDelete = () => {
    if (deleteInput === deleteModal.roco.nombre) {
      onDeleteRocodromo(deleteModal.roco.id);
      setDeleteModal({ isOpen: false, roco: null });
      setDeleteInput('');
    } else {
      setDeleteError('El nombre introducido no coincide. Inténtalo de nuevo.');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, roco: null });
    setDeleteInput('');
    setDeleteError('');
  };

  const rocosFiltrados = rocodromos.filter(r => 
    r.nombre?.toLowerCase().includes(searchRoco.toLowerCase())
  );

  const usuariosFiltrados = usuarios.filter(u => 
    u.email?.toLowerCase().includes(searchUser.toLowerCase()) || 
    u.nombre?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <header className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.title}>Panel de Control Global</h1>
            <p className={styles.subtitle}>Superadministración de Vertical Hub</p>
          </div>
        </header>

        <div className={styles.dashboardLayout}>
          <div className={styles.tabsContainer}>
            <button className={`${styles.tab} ${activeTab === 'rocodromos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('rocodromos')}>
              <MapPin size={16} /> Rocódromos
            </button>
            <button className={`${styles.tab} ${activeTab === 'usuarios' ? styles.activeTab : ''}`} onClick={() => setActiveTab('usuarios')}>
              <Users size={16} /> Usuarios y Roles
            </button>
            <button className={`${styles.tab} ${activeTab === 'fotos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('fotos')}>
              <ImageIcon size={16} /> Banco de Fotos
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'rocodromos' && (
              <div className={styles.sectionGrid}>
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Registrar Nuevo Centro</h2>
                  <form onSubmit={handleAddSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label>Nombre del Rocódromo</label>
                      <input type="text" value={nuevoRoco.nombre} onChange={(e) => setNuevoRoco({ ...nuevoRoco, nombre: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Ciudad / Ubicación</label>
                      <input type="text" value={nuevoRoco.ubicacion} onChange={(e) => setNuevoRoco({ ...nuevoRoco, ubicacion: e.target.value })} />
                    </div>
                    <div className={styles.rowInputs}>
                      <div className={styles.inputGroup}>
                        <label>Latitud Mapa</label>
                        <input type="number" step="any" value={nuevoRoco.latitud} onChange={(e) => setNuevoRoco({ ...nuevoRoco, latitud: e.target.value })} placeholder="40.4168" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Longitud Mapa</label>
                        <input type="number" step="any" value={nuevoRoco.longitud} onChange={(e) => setNuevoRoco({ ...nuevoRoco, longitud: e.target.value })} placeholder="-3.7038" />
                      </div>
                    </div>
                    <div className={styles.rowInputs}>
                      <div className={styles.inputGroup}>
                        <label>Aforo Máximo</label>
                        <input type="number" value={nuevoRoco.aforoMaximo} onChange={(e) => setNuevoRoco({ ...nuevoRoco, aforoMaximo: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>URL de Imagen Principal</label>
                      <input type="text" value={nuevoRoco.imagenUrl} onChange={(e) => setNuevoRoco({ ...nuevoRoco, imagenUrl: e.target.value })} />
                    </div>
                    <Button type="submit" variant="primary" style={{ width: '100%' }}>
                      <Plus size={16} /> Añadir Rocódromo
                    </Button>
                  </form>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeaderWithSearch}>
                    <h2 className={styles.cardTitle}>Centros Activos</h2>
                    <div className={styles.searchBox}>
                      <Search size={16} />
                      <input type="text" placeholder="Buscar centro..." value={searchRoco} onChange={(e) => setSearchRoco(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.listArea}>
                    {rocosFiltrados.map((roco) => (
                      <div key={roco.id} className={styles.listItem}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{roco.nombre}</span>
                          <span className={styles.itemSub}>{roco.ubicacion} • Aforo Max: {roco.aforoMaximo}</span>
                        </div>
                        <button 
                          className={styles.deleteBtn} 
                          onClick={() => {
                            setDeleteModal({ isOpen: true, roco });
                            setDeleteInput('');
                            setDeleteError('');
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div className={styles.card}>
                <div className={styles.cardHeaderWithSearch}>
                  <h2 className={styles.cardTitle}>Gestión de Usuarios</h2>
                  <div className={styles.searchBox}>
                    <Search size={16} />
                    <input type="text" placeholder="Buscar por email o nombre..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                  </div>
                </div>
                
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((u) => (
                        <tr key={u.id} className={u.bloqueado ? styles.rowBlocked : ''}>
                          <td>{u.nombre || 'Sin nombre'}</td>
                          <td>{u.email}</td>
                          <td>
                            <select 
                              value={u.rol || 'user'} 
                              onChange={(e) => onUpdateUserRole(u.id, e.target.value, u.adminRocoId)}
                              className={styles.roleSelect}
                              disabled={u.bloqueado}
                            >
                              <option value="user">Usuario Estándar</option>
                              <option value="rocoadmin">Admin de Rocódromo</option>
                              <option value="superadmin">Superadmin</option>
                            </select>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${u.bloqueado ? styles.blocked : styles.active}`}>
                              {u.bloqueado ? 'Bloqueado' : 'Activo'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className={`${styles.blockBtn} ${u.bloqueado ? styles.unlockAction : styles.lockAction}`}
                              onClick={() => onToggleBlockUser(u.id, u.bloqueado)}
                            >
                              {u.bloqueado ? <><Unlock size={14} /> Desbloquear</> : <><Lock size={14} /> Bloquear</>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'fotos' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Banco Global de Imágenes</h2>
                <div className={styles.photoGrid}>
                  {fotos.map(f => (
                    <div key={f.uid} className={styles.photoCard}>
                      <div className={styles.photoThumbnail} style={{ backgroundImage: `url(${f.url})` }}></div>
                      <div className={styles.photoDetails}>
                        <span className={styles.photoOrigin}>{f.origen}</span>
                        <div className={styles.photoEditRow}>
                          <input 
                            type="text" 
                            value={editUrls[f.uid] !== undefined ? editUrls[f.uid] : f.url} 
                            onChange={(e) => handlePhotoUrlChange(f.uid, e.target.value)}
                            className={styles.urlInput}
                          />
                          <button className={styles.saveUrlBtn} onClick={() => savePhotoUrl(f)}>
                            <Save size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {deleteModal.isOpen && deleteModal.roco && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.iconWrapper}>
                <ShieldAlert size={24} color="#ef4444" />
              </div>
              <button className={styles.closeModalBtn} onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            
            <h3 className={styles.modalTitle}>Eliminar Rocódromo</h3>
            
            <p className={styles.modalText}>
              Estás a punto de borrar <strong>{deleteModal.roco.nombre}</strong>. Esta acción es permanente y no se puede deshacer.
            </p>
            <p className={styles.modalText}>
              Para confirmar, escribe el nombre exacto del centro:
            </p>

            <input 
              type="text" 
              value={deleteInput} 
              onChange={(e) => {
                setDeleteInput(e.target.value);
                setDeleteError('');
              }}
              placeholder={deleteModal.roco.nombre}
              className={`${styles.modalInput} ${deleteError ? styles.inputError : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmDelete();
              }}
            />

            {deleteError && <span className={styles.errorText}>{deleteError}</span>}

            <div className={styles.modalActions}>
              <Button 
                variant="outline" 
                onClick={closeDeleteModal}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={confirmDelete}
                style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
                disabled={deleteInput !== deleteModal.roco.nombre}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}