'use client';

import { useState } from 'react';
import { Search, UserCheck, Shield, Building } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './adminRoles.module.scss';

export default function AdminRolesTemplate({ usuarios = [], rocodromos = [], onUpdateUserRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleForm, setRoleForm] = useState({ rol: '', adminRocoId: '' });

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setRoleForm({
      rol: u.rol || 'user',
      adminRocoId: u.adminRocoId || ''
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    onUpdateUserRole(selectedUser.id, roleForm.rol, roleForm.adminRocoId);
    setSelectedUser(null);
  };

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Roles de Usuario</h1>
          <p className={styles.subtitle}>Asigna privilegios de SuperAdmin o vincula cuentas como RocoAdmin.</p>
        </header>

        <div className={styles.layoutGrid}>
          <div className={styles.listCard}>
            <div className={styles.searchBar}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Buscar usuario por nombre o email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.userList}>
              {filteredUsuarios.length === 0 ? (
                <p className={styles.emptyText}>No se encontraron usuarios.</p>
              ) : (
                filteredUsuarios.map(u => (
                  <div 
                    key={u.id} 
                    className={`${styles.userItem} ${selectedUser?.id === u.id ? styles.userItemActive : ''}`}
                    onClick={() => handleSelectUser(u)}
                  >
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{u.nombre || 'Sin nombre'}</span>
                      <span className={styles.userEmail}>{u.email}</span>
                    </div>
                    <span className={`${styles.roleBadge} ${styles[u.rol || 'user']}`}>
                      {u.rol || 'user'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.editCard}>
            {selectedUser ? (
              <>
                <h2 className={styles.cardTitle}>
                  <UserCheck size={20} /> Modificar Privilegios
                </h2>
                <div className={styles.selectedMeta}>
                  <p>Usuario: <strong>{selectedUser.nombre}</strong></p>
                  <p>Email: <span>{selectedUser.email}</span></p>
                </div>

                <form onSubmit={handleSave} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label><Shield size={14} /> Rol Asignado</label>
                    <select 
                      value={roleForm.rol} 
                      onChange={(e) => setRoleForm({ ...roleForm, rol: e.target.value })}
                    >
                      <option value="user">Usuario (Atleta)</option>
                      <option value="rocoadmin">Administrador de Rocódromo (RocoAdmin)</option>
                      <option value="superadmin">Administrador Global (SuperAdmin)</option>
                    </select>
                  </div>

                  {roleForm.rol === 'rocoadmin' && (
                    <div className={styles.inputGroup}>
                      <label><Building size={14} /> Vincular Rocódromo</label>
                      <select 
                        value={roleForm.adminRocoId} 
                        onChange={(e) => setRoleForm({ ...roleForm, adminRocoId: e.target.value })}
                        required
                      >
                        <option value="">Selecciona un centro...</option>
                        {rocodromos.map(r => (
                          <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '12px' }}>
                    Guardar Cambios de Rol
                  </Button>
                </form>
              </>
            ) : (
              <div className={styles.placeholderCard}>
                <UserCheck size={48} />
                <p>Selecciona un usuario de la lista de la izquierda para gestionar sus permisos y roles.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}