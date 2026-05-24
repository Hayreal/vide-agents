import Link from 'next/link';
import styles from './not-found.module.css';

export default function VideoNotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>VIDEO NOT FOUND</p>
      <div className={styles.divider}>
        {'='.repeat(20)}
      </div>
      <p className={styles.hint}>
        The video you are looking for does not exist.
      </p>
      <Link href="/video" className={styles.backLink}>
        [ BACK TO ARCHIVE ]
      </Link>
    </div>
  );
}
