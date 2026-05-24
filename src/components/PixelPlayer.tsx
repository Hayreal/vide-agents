'use client';

import { useRef, useState, useCallback } from 'react';
import styles from './PixelPlayer.module.css';

interface PixelPlayerProps {
  src: string;
  poster?: string;
  title: string;
}

export default function PixelPlayer({ src, poster, title }: PixelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      video.currentTime = percent * video.duration;
      setProgress(percent * 100);
    },
    []
  );

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  return (
    <div className={styles.player}>
      {/* Video element */}
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        playsInline
        preload="metadata"
      />

      {/* Center play button overlay (when paused) */}
      {!isPlaying && (
        <div className={styles.centerPlay} onClick={handlePlayPause}>
          <span className={styles.bigPlayIcon}>▶</span>
        </div>
      )}

      {/* Bottom controls */}
      <div className={styles.controls}>
        {/* Progress bar */}
        <div className={styles.progressBar} onClick={handleProgressClick}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
            <div
              className={styles.progressThumb}
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div className={styles.buttons}>
          <button
            className={styles.controlBtn}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <span className={styles.btnIcon}>
                <span className={styles.pauseBar} />
                <span className={styles.pauseBar} />
              </span>
            ) : (
              <span className={styles.btnIcon}>▶</span>
            )}
          </button>

          <button
            className={styles.controlBtn}
            onClick={handleMuteToggle}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className={styles.btnIcon}>
              {isMuted ? '🔇' : '🔊'}
            </span>
          </button>

          <span className={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span className={styles.titleDisplay}>{title}</span>
        </div>
      </div>
    </div>
  );
}
