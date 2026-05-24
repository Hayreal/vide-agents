import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          {'>'} VIDE_AGENTS
        </h1>
        <p className={styles.subtitle}>
          RETRO PIXEL VIDEO EXPERIENCE
        </p>
        <div className={styles.divider}>
          {'='.repeat(30)}
        </div>
        <p className={styles.description}>
          Welcome to the pixel-art video player.<br />
          Navigate to the video section to start watching.
        </p>
        <Link href="/video" className={styles.enterButton}>
          [ ENTER VIDEO ]
        </Link>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>▶</span>
          <h3>PLAY / PAUSE</h3>
          <p>Basic playback controls</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🔇</span>
          <h3>MUTE TOGGLE</h3>
          <p>Audio control support</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📱</span>
          <h3>MOBILE FIRST</h3>
          <p>Optimized for portrait mode</p>
        </div>
      </div>
    </div>
  );
}
