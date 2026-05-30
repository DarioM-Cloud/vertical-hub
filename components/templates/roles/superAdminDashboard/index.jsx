'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Building2, Trash2, ShieldAlert } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Button from '@/components/_base/ui/button';
import styles from './superAdminDashboard.module.scss';

export default function SuperAdminDashboardTemplate({ 
  rocodromos = [], 
  onAddRocodromo, 
  onDeleteRocodromo 
}) {
  const [nuevoRoco, setNuevoRoco] = useState({ nombre: '', ubicacion: '', aforoMaximo: 100 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoRoco.nombre || !nuevoRoco.ubicacion) return;
    onAddRocodromo(nuevoRoco);
    setNuevoRoco({ nombre: '', ubicacion: '', aforoMaximo: 100 });
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
                    <button className={styles.deleteBtn} onClick={() => onDeleteRocodromo(roco.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}