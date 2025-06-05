// components/HlsPlayer.tsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
  width?: string;
  height?: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src, width = '100%', height = 'auto' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Trình duyệt hỗ trợ HLS natively (Safari)
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else {
      console.error('HLS is not supported in this browser');
    }
  }, [src]);

  return <video ref={videoRef} width={width} height={height} style={{ backgroundColor: 'black' }} />;
};

export default HlsPlayer;
