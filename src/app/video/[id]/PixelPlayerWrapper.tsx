'use client';

import { VideoData } from '@/data/videos';
import PixelPlayer from '@/components/PixelPlayer';

interface Props {
  video: VideoData;
}

export default function PixelPlayerWrapper({ video }: Props) {
  return (
    <PixelPlayer
      src={video.videoUrl}
      poster={video.coverUrl}
      title={video.title}
    />
  );
}
