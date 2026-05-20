'use client';

import { useState } from 'react';
import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Input from '@/components/_base/ui/input';
import Tag from '@/components/_base/ui/tag';
import Loader from '@/components/_base/ui/loader';
import Text from '@/components/_base/ui/text';
import GymCard from '@/components/_base/cards/gymCard';
import styles from './rocodromos.module.scss';

export default function RocodromosTemplate({ rocodromos = [], loading }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredRocodromos = rocodromos.filter((roco) => {
    const matchesSearch = 
      roco.nombre?.toLowerCase().includes(search.toLowerCase()) || 
      roco.ubicacion?.toLowerCase().includes(search.toLowerCase());
      
    if (activeFilter === 'Todos') return matchesSearch;
    if (activeFilter === 'Solo Boulder' && !roco.tieneVias) return matchesSearch;
    if (activeFilter === 'Con Vías' && roco.tieneVias) return matchesSearch;
    
    return matchesSearch;
  });

  return (
    <Container>
      <Section className={styles.header}>
        <Heading level={1}>Explorar Rocódromos</Heading>
        <div className={styles.searchWrapper}>
          <Input 
            placeholder="Buscar por nombre o ciudad..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Section>

      <Section className={styles.filters}>
        <div className={styles.tags}>
          <Tag 
            active={activeFilter === 'Todos'} 
            onClick={() => setActiveFilter('Todos')}
          >
            Todos
          </Tag>
          <Tag 
            active={activeFilter === 'Solo Boulder'} 
            onClick={() => setActiveFilter('Solo Boulder')}
          >
            Solo Boulder
          </Tag>
          <Tag 
            active={activeFilter === 'Con Vías'} 
            onClick={() => setActiveFilter('Con Vías')}
          >
            Con Vías
          </Tag>
        </div>
      </Section>

      <Section>
        {loading ? (
          <Loader text="Cargando directorio..." />
        ) : filteredRocodromos.length > 0 ? (
          <div className={styles.grid}>
            {filteredRocodromos.map((roco) => (
              <GymCard key={roco.id} {...roco} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className={styles.empty}>
            No se encontraron rocódromos con esos filtros.
          </Text>
        )}
      </Section>
    </Container>
  );
}