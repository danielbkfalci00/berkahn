"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { ArticleVideo } from "@/types/article";

interface VideoEmbedProps {
  video: ArticleVideo;
  className?: string;
}

export function VideoEmbed({ video, className = "" }: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine aspect ratio class
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[video.aspectRatio || "16:9"];

  // Generate embed URL based on platform
  const getEmbedUrl = () => {
    switch (video.platform) {
      case "youtube":
        return `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&modestbranding=1`;
      case "vimeo":
        return `https://player.vimeo.com/video/${video.videoId}?title=0&byline=0&portrait=0`;
      case "direct":
        return video.url || "";
      default:
        return "";
    }
  };

  const embedUrl = getEmbedUrl();

  // Lazy load iframe when in view
  useEffect(() => {
    if (isInView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isInView, isLoaded]);

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      {video.title && (
        <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
          <h3 className="headline-sm">{video.title}</h3>
        </div>
      )}

      {/* Video Embed */}
      <div className={`relative w-full ${aspectRatioClass} bg-black-10`}>
        {isLoaded ? (
          video.platform === "direct" && video.url ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              controls
              preload="metadata"
            >
              <source src={video.url} type="video/mp4" />
              Seu navegador não suporta reprodução de vídeo.
            </video>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedUrl}
              title={video.title || "Vídeo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )
        ) : (
          // Loading placeholder
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-black-20 border-t-black rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Caption */}
      {video.caption && (
        <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6">
          <p className="text-sm text-black-60 mt-3">{video.caption}</p>
        </div>
      )}
    </motion.div>
  );
}
