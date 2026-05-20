import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import Button from '@/components/_base/ui/button';
import Tag from '@/components/_base/ui/tag';
import Loader from '@/components/_base/ui/loader';
import PostCard from '@/components/_base/cards/postCard';
import styles from './comunidad.module.scss';

export default function ComunidadTemplate({ posts = [], loading }) {
  return (
    <Container>
      <Section className={styles.headerSection}>
        <div>
          <Heading level={1}>Últimos Encadenes</Heading>
          <Text variant="muted">Descubre las betas de la comunidad local.</Text>
        </div>
        <Button variant="primary">+ Subir Beta</Button>
      </Section>

      <Section className={styles.filtersSection}>
        <div className={styles.filtersWrapper}>
          <Tag active>Todos</Tag>
          <Tag>Bloque</Tag>
          <Tag>Vía</Tag>
          <Tag>Mi Rocódromo</Tag>
        </div>
      </Section>

      <Section className={styles.feedSection}>
        {loading ? (
          <Loader text="Cargando encadenes..." />
        ) : posts.length > 0 ? (
          <div className={styles.grid}>
            {posts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className={styles.empty}>
            Aún no hay publicaciones. ¡Anímate a ser el primero!
          </Text>
        )}
      </Section>
    </Container>
  );
}