'use client';

import { useState } from 'react';
import { Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import GymCard from '@/components/_base/cards/gymCard';
import GymMap from '@/components/_base/ui/map';
import FilterBar from '@/components/_base/ui/filterBar';
import AdminSpeedDial from '@/components/_base/ui/adminSpeedDial';
import styles from './home.module.scss';

export default function HomeTemplate({ rocodromos = [], tickets = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [selectedModalidad, setSelectedModalidad] = useState('');
  const [selectedServicio, setSelectedServicio] = useState('');

  const ubicacionesUnicas = Array.from(new Set(rocodromos.map(r => r.ubicacion)));

  const filteredRocodromos = rocodromos.filter(roco => {
    const matchesSearch = roco.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUbicacion = !selectedUbicacion || roco.ubicacion === selectedUbicacion;
    const matchesModalidad = !selectedModalidad || (roco.modalidades && roco.modalidades.includes(selectedModalidad));
    const matchesServicio = !selectedServicio || (roco.servicios && roco.servicios.includes(selectedServicio));

    return matchesSearch && matchesUbicacion && matchesModalidad && matchesServicio;
  });

  return (
    <div className={styles.homeWrapper}>
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <h1>Vertical Hub</h1>
            <p>La red de escalada más grande de España</p>
          </div>
        </Container>
      </section>

      <Section className={styles.gymsSection}>
        <Container>
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUbicacion={selectedUbicacion}
            onUbicacionChange={setSelectedUbicacion}
            ubicacionesUnicas={ubicacionesUnicas}
            selectedModalidad={selectedModalidad}
            onModalidadChange={setSelectedModalidad}
            selectedServicio={selectedServicio}
            onServicioChange={setSelectedServicio}
          />

          <div className={styles.resultsHeader}>
            <h2>Rocódromos disponibles ({filteredRocodromos.length})</h2>
          </div>

          {filteredRocodromos.length === 0 ? (
            <div className={styles.noResults}>
              <SlidersHorizontal size={36} />
              <p>No se encontraron rocódromos que cumplan con los criterios seleccionados.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredRocodromos.map((roco) => {
                const rocoTickets = tickets.filter(t => t.rocodromoId === roco.id);
                return <GymCard key={roco.id} data={roco} activeTickets={rocoTickets} />;
              })}
            </div>
          )}
        </Container>
      </Section>

      <Section className={styles.mapSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <MapIcon size={24} />
            <h2>Mapa de Centros</h2>
          </div>
          <div className={styles.mapWrapper}>
            <GymMap gyms={filteredRocodromos} />
          </div>
        </Container>
      </Section>

      <AdminSpeedDial />
    </div>
  );
}