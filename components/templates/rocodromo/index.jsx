import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import SectorCard from '@/components/_base/cards/sectorCard';
import styles from './rocodromo.module.scss';

export default function RocodromoDetailTemplate({ rocodromo, sectores = [] }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.heroBanner}></div>
      <Container className={styles.content}>
        <Section className={styles.headerInfo}>
          <Heading level={1}>{rocodromo?.nombre || "Cargando..."}</Heading>
          <Text className={styles.location}>{rocodromo?.ubicacion}</Text>
          <div className={styles.aforoBadge}>
            Aforo: {rocodromo?.aforoActual || 0} / {rocodromo?.aforoMaximo || 0}
          </div>
        </Section>

        <Section>
          <Heading level={2}>Sectores Disponibles</Heading>
          <div className={styles.sectoresGrid}>
            {sectores.map((sector) => (
              <SectorCard key={sector.id} {...sector} />
            ))}
          </div>
        </Section>
      </Container>
    </div>
  );
}