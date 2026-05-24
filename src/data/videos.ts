export interface VideoData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: string;
  author: string;
}

const videos: VideoData[] = [
  {
    id: 'vid-001',
    title: 'Pixel Journey',
    description:
      'A short animated journey through a retro pixel world. Watch as the hero explores landscapes of times past.',
    coverUrl: '/covers/pixel-journey.png',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:15',
    author: 'VIDE Studio',
  },
  {
    id: 'vid-002',
    title: 'Neon Nights',
    description:
      'Experience the vibrant neon-lit streets of a cyberpunk city. A visual treat for retro-futurism lovers.',
    coverUrl: '/covers/neon-nights.png',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '0:15',
    author: 'VIDE Studio',
  },
  {
    id: 'vid-003',
    title: 'Retro Wave',
    description:
      'Chill out to lo-fi beats with a retro wave aesthetic. Perfect for relaxation and focus.',
    coverUrl: '/covers/retro-wave.png',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '0:30',
    author: 'Pixel Artist',
  },
  {
    id: 'vid-004',
    title: '8-Bit Adventure',
    description:
      'Join the hero on an 8-bit adventure through dungeons and forests. Classic platformer vibes.',
    coverUrl: '/covers/8bit-adventure.png',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '0:15',
    author: 'Retro Games Inc.',
  },
  {
    id: 'vid-005',
    title: 'Space Quest',
    description:
      'Blast off into the cosmos with this retro space exploration video. Stars, planets, and beyond.',
    coverUrl: '/covers/space-quest.png',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '0:15',
    author: 'Space Studio',
  },
];

export function getAllVideos(): VideoData[] {
  return videos;
}

export function getVideoById(id: string): VideoData | undefined {
  return videos.find((v) => v.id === id);
}
