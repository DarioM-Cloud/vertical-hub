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
  return (
    <Container>
      <Section className={styles.header}>
        <Heading level={1}>Explorar Rocódromos</Heading>
        <div className={styles.searchWrapper}>
          <Input placeholder="Buscar por nombre o ciudad..." />
        </div>
      </Section>

      <Section className={styles.filters}>
        <div className={styles.tags}>
          <Tag active>Cerca de mí</Tag>
          <Tag>Solo Boulder</Tag>
          <Tag>Con Vías</Tag>
        </div>
      </Section>

      <Section>
        {loading ? (
          <Loader text="Cargando directorio..." />
        ) : rocodromos.length > 0 ? (
          <div className={styles.grid}>
            {rocodromos.map((roco) => (
              <GymCard key={roco.id} {...roco} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className={styles.empty}>
            No se encontraron rocódromos.
          </Text>
        )}
      </Section>
    </Container>
  );
}