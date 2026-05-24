import Link from 'next/link';
import { getAllVideos } from '@/data/videos';
import styles from './page.module.css';

export default function VideoPage() {
  const videos = getAllVideos();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>&gt; VIDEO_ARCHIVE</h1>
        <p className={styles.subtitle}>
          Select a video to begin playback
        </p>
        <div className={styles.divider}>
          {'='.repeat(30)}
        </div>
      </div>

      <div className={styles.grid}>
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className={styles.card}
          >
            <div className={styles.cover}>
              <img
                src={video.coverUrl}
                alt={video.title}
                className={styles.coverImage}
              />
              <div className={styles.playOverlay}>
                <span className={styles.playIcon}>▶</span>
              </div>
              <span className={styles.duration}>{video.duration}</span>
            </div>
            <div className={styles.info}>
              <h2 className={styles.videoTitle}>{video.title}</h2>
              <p className={styles.author}>{video.author}</p>
              <p className={styles.description}>{video.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
