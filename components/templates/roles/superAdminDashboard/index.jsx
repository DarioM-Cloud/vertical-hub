'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Building2, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import Modal from '@/components/_base/ui/modal';
import styles from './superAdminDashboard.module.scss';

export default function SuperAdminDashboardTemplate({ 
  rocodromos = [], 
  onAddRocodromo, 
  onDeleteRocodromo 
}) {
  const [nuevoRoco, setNuevoRoco] = useState({ nombre: '', ubicacion: '', aforoMaximo: 100 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoco, setSelectedRoco] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoRoco.nombre || !nuevoRoco.ubicacion) return;
    onAddRocodromo(nuevoRoco);
    setNuevoRoco({ nombre: '', ubicacion: '', aforoMaximo: 100 });
  };

  const openDeleteVerification = (roco) => {
    setSelectedRoco(roco);
    setConfirmName('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRoco && confirmName === selectedRoco.nombre) {
      onDeleteRocodromo(selectedRoco.id);
      setIsDeleteModalOpen(false);
      setSelectedRoco(null);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Container className={styles.container}>
        <header className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.title}>Consola Central SuperAdmin</h1>
            <p className={styles.subtitle}>
              Control maestro global del ecosistema de escalada Vertical Hub.
            </p>
          </div>
        </header>

        <div className={styles.sectionGrid}>
          <div className={styles.adminLinksCard}>
            <h2 className={styles.cardTitle}><ShieldAlert size={20}/> Accesos Globales de Seguridad</h2>
            <div className={styles.linksWrapper}>
              <Link href="/admin-roles" className={styles.adminLink}>Gestionar Roles de Usuario</Link>
              <Link href="/admin-fotos" className={styles.adminLink}>Gestionar Banco de Fotos</Link>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Plus size={20} /> Añadir Nuevo Rocódromo
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Nombre del Rocódromo</label>
                <input
                  type="text"
                  value={nuevoRoco.nombre}
                  onChange={(e) => setNuevoRoco({ ...nuevoRoco, nombre: e.target.value })}
                  placeholder="Ej: Skala Burgos"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Ubicación / Ciudad</label>
                <input
                  type="text"
                  value={nuevoRoco.ubicacion}
                  onChange={(e) => setNuevoRoco({ ...nuevoRoco, ubicacion: e.target.value })}
                  placeholder="Ej: Burgos, España"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Aforo Máximo</label>
                <input
                  type="number"
                  value={nuevoRoco.aforoMaximo}
                  onChange={(e) => setNuevoRoco({ ...nuevoRoco, aforoMaximo: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '12px' }}>
                Registrar Rocódromo
              </Button>
            </form>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Building2 size={20} /> Rocódromos Registrados ({rocodromos.length})
            </h2>
            <div className={styles.listArea}>
              {rocodromos.length === 0 ? (
                <p className={styles.emptyText}>No hay rocódromos registrados en la plataforma.</p>
              ) : (
                rocodromos.map((roco) => (
                  <div key={roco.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemMainText}>{roco.nombre}</span>
                      <p className={styles.itemSubText}>{roco.ubicacion} • Aforo máx: {roco.aforoMaximo}</p>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => openDeleteVerification(roco)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Verificación Requerida">
        <div className={styles.verificationForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            <AlertTriangle size={24} color="#dc2626" />
            <p style={{ fontSize: '13px', color: '#991b1b', margin: 0, fontWeight: 600 }}>
              Esta acción es irreversible y eliminará el centro junto con toda su configuración interna.
            </p>
          </div>
          <p style={{ fontSize: '14px', color: '#334155', margin: 0 }}>
            Para confirmar la eliminación, escribe el nombre exacto del rocódromo: <strong style={{ color: '#0f172a' }}>{selectedRoco?.nombre}</strong>
          </p>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              value={confirmName} 
              onChange={(e) => setConfirmName(e.target.value)} 
              placeholder="Escribe el nombre aquí..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <Button 
            variant="primary" 
            onClick={handleConfirmDelete} 
            disabled={confirmName !== selectedRoco?.nombre}
            style={{ width: '100%', background: confirmName === selectedRoco?.nombre ? '#dc2626' : '#cbd5e1' }}
          >
            Eliminar Definitivamente
          </Button>
        </div>
      </Modal>
    </div>
  );
}