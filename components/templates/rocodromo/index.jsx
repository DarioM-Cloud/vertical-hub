'use client';

import { useState } from 'react';
import { MapPin, Layers, CheckCircle2, Hammer, Plus, Minus, Users, Trash2 } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import PostCard from '@/components/_base/cards/postCard';
import OccupancyCard from '@/components/_base/cards/occupancyCard';
import TablonAvisos from '@/components/_base/tablonAvisos';
import ListadoVias from '@/components/_base/listadoVias';
import ModalAscension from '@/components/_base/ui/modalAscension';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/_base/ui/button';
import styles from './rocodromo.module.scss';

export default function RocodromoTemplate({ rocodromo, posts, avisos, vias, sectores, onAddAscension, submittingAscension }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVia, setSelectedVia] = useState(null);
  const [estiloAscenso, setEstiloAscenso] = useState('a vista');
  const [intentos, setIntentos] = useState(1);

  const [nuevoAviso, setNuevoAviso] = useState('');
  const [nuevoSector, setNuevoSector] = useState({ nombre: '', zona: '', gradoPredominante: '', viasCount: 0 });

  const tienePermisosGestion = user?.isSuperAdmin || (user?.isRocoAdmin && user?.adminRocoId === rocodromo.id);

  const handleOpenModal = (via) => {
    if (!user) {
      alert('Debes iniciar sesión para registrar ascensiones');
      return;
    }
    setSelectedVia(via);
    setEstiloAscenso('a vista');
    setIntentos(1);
    setIsModalOpen(true);
  };

  const handleSaveAscension = async () => {
    if (!selectedVia) return;
    await onAddAscension(user.uid, {
      rocodromoId: rocodromo.id,
      rocodromo: rocodromo.nombre,
      via: selectedVia.nombre,
      grado: selectedVia.grado,
      tipo: estiloAscenso,
      intentos: estiloAscenso === 'pegues' ? intentos : 1
    });
    setIsModalOpen(false);
  };

  const modifAforo = async (cantidad) => {
    if (cantidad > 0 && rocodromo.aforoActual >= rocodromo.aforoMaximo) return;
    if (cantidad < 0 && rocodromo.aforoActual <= 0) return;
    
    const rocoRef = doc(db, 'rocodromos', rocodromo.id);
    await updateDoc(rocoRef, {
      aforoActual: increment(cantidad)
    });
  };

  const agregarAnuncioAdmin = async (e) => {
    e.preventDefault();
    if (!nuevoAviso.trim()) return;

    const rocoRef = doc(db, 'rocodromos', rocodromo.id);
    await updateDoc(rocoRef, {
      avisos: arrayUnion({
        id: Date.now().toString(),
        texto: nuevoAviso,
        fecha: new Date().toISOString()
      })
    });
    setNuevoAviso('');
  };

  const agregarSectorAdmin = async (e) => {
    e.preventDefault();
    if (!nuevoSector.nombre.trim()) return;

    const rocoRef = doc(db, 'rocodromos', rocodromo.id);
    await updateDoc(rocoRef, {
      sectores: arrayUnion({
        id: Date.now().toString(),
        nombre: nuevoSector.nombre,
        zona: nuevoSector.zona,
        gradoPredominante: nuevoSector.gradoPredominante,
        viasCount: Number(nuevoSector.viasCount),
        estado: 'Abierto',
        diasRenovacion: 0
      })
    });
    setNuevoSector({ nombre: '', zona: '', gradoPredominante: '', viasCount: 0 });
  };

  const borrarPublicacionModeracion = async (postId) => {
    if (confirm('¿Deseas eliminar esta publicación de la comunidad por inapropiada?')) {
      await deleteDoc(doc(db, 'posts', postId));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div 
        className={styles.hero}
        style={{ backgroundImage: `url(${rocodromo?.imagenUrl || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})` }}
      >
        <div className={styles.heroOverlay}></div>
        <Container className={styles.heroContent}>
          <h1>{rocodromo.nombre}</h1>
          <div className={styles.location}>
            <MapPin size={18} />
            <span>{rocodromo.ubicacion}</span>
          </div>
        </Container>
      </div>

      <Container className={styles.mainContainer}>
        <OccupancyCard rocodromo={rocodromo} />

        {tienePermisosGestion && (
          <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: '800' }}>
              <Users size={18} /> Panel de Gestión de Instalación
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Simulador de Torno de Entrada:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => modifAforo(1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  <Plus size={16} /> Entrada Cliente
                </button>
                <button onClick={() => modifAforo(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  <Minus size={16} /> Salida Cliente
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <form onSubmit={agregarAnuncioAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Publicar en Tablón de Anuncios:</span>
                <input type="text" value={nuevoAviso} onChange={(e) => setNuevoAviso(e.target.value)} placeholder="Escribe un aviso para los socios..." style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
                <Button type="submit" variant="primary" style={{ padding: '8px' }}>Fijar Anuncio</Button>
              </form>

              <form onSubmit={agregarSectorAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Añadir Nuevo Sector:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input type="text" placeholder="Nombre Sector" value={nuevoSector.nombre} onChange={(e) => setNuevoSector({...nuevoSector, nombre: e.target.value})} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                  <input type="text" placeholder="Zona" value={nuevoSector.zona} onChange={(e) => setNuevoSector({...nuevoSector, zona: e.target.value})} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                  <input type="text" placeholder="Grado Medio" value={nuevoSector.gradoPredominante} onChange={(e) => setNuevoSector({...nuevoSector, gradoPredominante: e.target.value})} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                  <input type="number" placeholder="Nº Bloques" value={nuevoSector.viasCount || ''} onChange={(e) => setNuevoSector({...nuevoSector, viasCount: e.target.value})} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                </div>
                <Button type="submit" variant="outline" style={{ padding: '6px' }}>Dar de Alta Sector</Button>
              </form>
            </div>
          </div>
        )}

        <div className={styles.layout}>
          <div className={styles.leftColumn}>
            <TablonAvisos avisos={avisos} />
            
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <Layers size={20} />
                <h2>Sectores y Equipación</h2>
              </div>
              <div className={styles.sectoresList}>
                {sectores?.length === 0 ? (
                  <div className={styles.emptyAvisos}>No hay sectores registrados.</div>
                ) : (
                  sectores?.map(sector => (
                    <div key={sector.id} className={`${styles.sectorRow} ${sector.estado === 'Equipando' ? styles.sectorDisabled : ''}`}>
                      <div className={styles.sectorInfo}>
                        <div className={styles.sectorMain}>
                          <h3>{sector.nombre}</h3>
                          <span className={styles.sectorZone}>{sector.zona}</span>
                        </div>
                        <div className={styles.sectorTags}>
                          <span className={styles.gradoTag}>{sector.gradoPredominante}</span>
                          <span className={styles.viasTag}>{sector.viasCount} bloques</span>
                          {sector.viasNuevas > 0 && sector.estado !== 'Equipando' && (
                            <span className={styles.nuevasTag}>+{sector.viasNuevas} nuevos</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.sectorStatus}>
                        {sector.estado === 'Equipando' ? (
                          <div className={styles.statusBadgeWarning}>
                            <Hammer size={14} />
                            Equipando
                          </div>
                        ) : (
                          <div className={styles.statusBadgeSuccess}>
                            <CheckCircle2 size={14} />
                            Abierto
                          </div>
                        )}
                        <span className={styles.renovacionText}>Renovado hace {sector.diasRenovacion}d</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <ListadoVias vias={vias} onOpenModal={handleOpenModal} />
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sectionHeader}>
              <h2>Comunidad local</h2>
            </div>
            
            <div className={styles.postsList}>
              {posts?.length === 0 ? (
                <div className={styles.emptyPosts}>Nadie ha publicado nada sobre este rocódromo todavía.</div>
              ) : (
                posts?.map(post => (
                  <div key={post.id} style={{ position: 'relative' }}>
                    <PostCard data={post} />
                    {tienePermisosGestion && (
                      <button 
                        onClick={() => borrarPublicacionModeracion(post.id)}
                        style={{ position: 'absolute', top: '16px', right: '50px', background: '#fee2e2', border: 'none', padding: '6px', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                        title="Moderación: Borrar Post"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>

      <ModalAscension 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rocodromo={rocodromo}
        selectedVia={selectedVia}
        estiloAscenso={estiloAscenso}
        setEstiloAscenso={setEstiloAscenso}
        intentos={intentos}
        setIntentos={setIntentos}
        onSave={handleSaveAscension}
        submitting={submittingAscension}
      />
    </div>
  );
}