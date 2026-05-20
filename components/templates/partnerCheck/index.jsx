import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Button from '@/components/_base/ui/button';
import Loader from '@/components/_base/ui/loader';
import PartnerTicket from '@/components/_base/cards/partnerTicket';
import styles from './partnerCheck.module.scss';

export default function PartnerCheckTemplate({ solicitudes = [], loading }) {
  return (
    <Container className={styles.container}>
      <Section className={styles.header}>
        <div className={styles.titleWrapper}>
          <Heading level={1}>Partner Check</Heading>
          <Text variant="muted">Encuentra compañero de cordada para tu próxima sesión.</Text>
        </div>
        <Button variant="primary">Crear Anuncio</Button>
      </Section>

      <Section>
        {loading ? (
          <Loader text="Buscando escaladores..." />
        ) : solicitudes.length > 0 ? (
          <div className={styles.grid}>
            {solicitudes.map((solicitud) => (
              <PartnerTicket key={solicitud.id} {...solicitud} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className={styles.empty}>
            No hay anuncios activos. ¡Sé el primero en crear uno!
          </Text>
        )}
      </Section>
    </Container>
  );
}