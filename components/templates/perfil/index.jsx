import Container from '@/components/_base/layout/container';
import Section from '@/components/_base/layout/section';
import Heading from '@/components/_base/ui/heading';
import Text from '@/components/_base/ui/text';
import StatBadge from '@/components/_base/dataDisplay/statBadge';
import PostCard from '@/components/_base/cards/postCard';
import styles from './perfil.module.scss';

export default function PerfilTemplate({ perfil, posts = [] }) {
  return (
    <Container className={styles.container}>
      <Section className={styles.profileHeader}>
        <div className={styles.avatar}>
          {perfil?.nombre?.charAt(0) || 'U'}
        </div>
        <div className={styles.userInfo}>
          <Heading level={1}>{perfil?.nombre || 'Usuario'}</Heading>
          <Text>{perfil?.bio || 'Sin biografía'}</Text>
        </div>
      </Section>

      <Section className={styles.stats}>
        <div className={styles.statsGrid}>
          <StatBadge label="Grado Máx." value={perfil?.gradoMax || '-'} highlight />
          <StatBadge label="Encadenes" value={posts.length} />
          <StatBadge label="Rocódromos" value={perfil?.rocodromosVisitados || 0} />
        </div>
      </Section>

      <Section>
        <Heading level={2}>Mi Logbook</Heading>
        <div className={styles.logbookGrid}>
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </Section>
    </Container>
  );
}