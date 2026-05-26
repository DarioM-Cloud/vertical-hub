'use client';

import { useState } from 'react';
import { MapPin, Layers, CheckCircle2, Hammer } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import PostCard from '@/components/_base/cards/postCard';
import OccupancyCard from '@/components/_base/cards/occupancyCard';
import TablonAvisos from '@/components/_base/tablonAvisos';
import ListadoVias from '@/components/_base/listadoVias';
import ModalAscension from '@/components/_base/ui/modalAscension';
import CreatePost from '@/components/_base/cards/createPost';
import styles from './rocodromo.module.scss';

export default function RocodromoTemplate({ rocodromo, posts, avisos, vias, sectores, currentUser, onAddAscension, submittingAscension }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVia, setSelectedVia] = useState(null);
  const [estiloAscenso, setEstiloAscenso] = useState('a vista');
  const [intentos, setIntentos] = useState(1);

  const handleOpenModal = (via) => {
    if (!currentUser) {
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
    
    await onAddAscension(currentUser.uid, {
      rocodromoId: rocodromo.id,
      rocodromo: rocodromo.nombre,
      via: selectedVia.nombre,
      grado: selectedVia.grado,
      tipo: estiloAscenso,
      intentos: estiloAscenso === 'pegues' ? intentos : 1
    });
    setIsModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
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
            
            <CreatePost 
              rocodromoId={rocodromo.id} 
              rocodromoNombre={rocodromo.nombre} 
              currentUser={currentUser} 
            />

            <div className={styles.postsList}>
              {posts?.length === 0 ? (
                <div className={styles.emptyPosts}>Nadie ha publicado nada sobre este rocódromo todavía.</div>
              ) : (
                posts?.map(post => <PostCard key={post.id} data={post} />)
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