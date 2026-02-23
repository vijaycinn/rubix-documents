'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi';

interface ZoomableImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ZoomableImage({ src, alt, caption }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleClose = () => {
    setIsOpen(false);
    setScale(1);
  };

  return (
    <>
      {/* Thumbnail view */}
      <div className="my-8 flex flex-col items-center gap-3">
        <div
          className="relative w-full max-w-4xl cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 shadow-md transition-all hover:shadow-xl hover:border-primary/50 group"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/90 rounded-full p-3">
                <FiZoomIn className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
        {caption && (
          <p className="text-sm text-muted-foreground text-center italic max-w-3xl">
            {caption}
          </p>
        )}
      </div>

      {/* Fullscreen zoom dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[90vw] !max-h-[88vh] !w-auto !h-auto p-0 overflow-hidden rounded-xl shadow-2xl sm:!max-w-[90vw]">
          <div className="relative flex flex-col max-h-[88vh] bg-background">
            {/* Header with controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
              {/* Zoom level indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Zoom: {Math.round(scale * 100)}%
                </span>
              </div>

              {/* Zoom controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 1}
                  className="bg-background hover:bg-muted border border-border rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <FiZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="bg-background hover:bg-muted border border-border rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <FiZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClose}
                  className="bg-background hover:bg-destructive/10 hover:text-destructive border border-border rounded-md p-2 transition-all hover:shadow-sm"
                  aria-label="Close"
                  title="Close (Esc)"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image container with scroll */}
            <div className="flex-1 overflow-auto bg-muted/20 min-h-0">
              <div
                className="relative min-w-full min-h-full flex items-center justify-center p-6"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-auto max-w-[80vw] rounded-sm"
                  priority
                />
              </div>
            </div>

            {/* Caption in fullscreen */}
            {caption && (
              <div className="px-6 py-3 border-t border-border bg-background/95 backdrop-blur-sm shrink-0">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {caption}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
