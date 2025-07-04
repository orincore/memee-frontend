import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, Copy, Facebook, Twitter, Download } from 'lucide-react';
import { Meme } from '../types';
import { likeMeme, unlikeMeme, saveMeme, unsaveMeme } from '../services/api';
import { LikeSaveButtons } from '../App';

interface MemeCardProps {
  meme: Meme;
  onClick?: () => void;
}

export const MemeCard: React.FC<MemeCardProps> = ({ meme, onClick }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Helper to check if the meme is a video
  const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

  // Intersection Observer for autoplay/autostop
  useEffect(() => {
    if (!isVideo(meme.cloudinary_url) || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in viewport - autoplay
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay failed (browser policy), keep paused
                setIsPlaying(false);
              });
              setIsPlaying(true);
            }
          } else {
            // Video is out of viewport - autostop
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.5 } // 50% of video must be visible
    );

    observer.observe(cardRef.current!);

    return () => {
      observer.disconnect();
    };
  }, [meme.cloudinary_url]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setMediaLoaded(true);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = meme.title || 'Check out this meme!';
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'download':
        // Create download link for Cloudinary URL
        const link = document.createElement('a');
        link.href = meme.cloudinary_url;
        link.download = `meme-${meme.id}.${meme.isVideo ? 'mp4' : 'jpg'}`;
        link.target = '_blank';
        link.click();
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6 border border-gray-100 dark:border-gray-700 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {meme.author?.charAt(0).toUpperCase() || 'M'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {meme.author || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {meme.timeAgo || 'Recently'}
            </p>
          </div>
        </div>
        
        <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full capitalize">
          {meme.category}
        </span>
      </div>

      {/* Title */}
      {meme.title && (
        <div className="px-4 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {meme.title}
          </h3>
        </div>
      )}

      {/* Media Container */}
      <div className="relative">
        {!mediaLoaded && (
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {isVideo(meme.cloudinary_url) ? (
          <div 
            className="relative"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={meme.cloudinary_url}
              className={`w-full h-auto max-h-[600px] object-contain transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              muted
              loop
              preload="metadata"
            />
            
            {/* Custom Video Controls */}
            {showControls && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-gray-900" />
                  ) : (
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  )}
                </button>
              </div>
            )}

            {/* Seek Bar */}
            {showControls && duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <div className="flex items-center space-x-2 text-white text-xs">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={meme.cloudinary_url}
            alt={meme.title || 'Meme'}
            className={`w-full h-auto max-h-[600px] object-contain transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setMediaLoaded(true)}
          />
        )}
      </div>

      {/* Actions at the bottom */}
      <div className="flex flex-col gap-2 px-4 pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
        <LikeSaveButtons meme={meme} />
        <div className="flex items-center space-x-6">
          <button
            onClick={e => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors"
          >
            <Share2 className="w-6 h-6" />
            <span className="font-medium">0</span>
          </button>
          {showShareMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-10">
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const response = await fetch(meme.cloudinary_url);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `meme-${meme.id}.${isVideo(meme.cloudinary_url) ? 'mp4' : 'jpg'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                      setShowShareMenu(false);
                    } catch (e) {
                      alert('Failed to download file.');
                    }
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};