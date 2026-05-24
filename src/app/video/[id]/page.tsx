import Link from 'next/link';
import { getVideoById, getAllVideos } from '@/data/videos';
import PixelPlayerWrapper from './PixelPlayerWrapper';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllVideos().map((v) => ({ id: v.id }));
}

export default function VideoDetailPage({ params }: Props) {
  const video = getVideoById(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/video" className={styles.backButton}>
        {'< BACK TO ARCHIVE'}
      </Link>

      <div className={styles.playerSection}>
        <PixelPlayerWrapper video={video} />
      </div>

      <div className={styles.infoSection}>
        <h1 className={styles.title}>{video.title}</h1>
        <div className={styles.meta}>
          <span className={styles.author}>{video.author}</span>
          <span className={styles.duration}>{video.duration}</span>
        </div>
        <p className={styles.description}>{video.description}</p>
      </div>

      <div className={styles.divider}>
        {'='.repeat(30)}
      </div>

      <div className={styles.related}>
        <h2 className={styles.relatedTitle}>&gt; MORE VIDEOS</h2>
        <div className={styles.relatedGrid}>
          {getAllVideos()
            .filter((v) => v.id !== video.id)
            .slice(0, 3)
            .map((v) => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className={styles.relatedCard}
              >
                <div className={styles.relatedCover}>
                  <img
                    src={v.coverUrl}
                    alt={v.title}
                    className={styles.relatedImage}
                  />
                </div>
                <span className={styles.relatedName}>{v.title}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
