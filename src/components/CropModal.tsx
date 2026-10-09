import React, { useEffect, useRef, useState } from 'react';
import { Check, Move, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

interface CropModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string) => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
  onApplyCrop,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const size = 320; // 320x320 square crop
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const img = imageRef.current;
    const cropBoxSize = 240; // Box visual size in modal

    // Compute scale and offsets
    const scaleFactor = size / cropBoxSize;
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);

    // Draw centered
    const aspect = img.naturalWidth / img.naturalHeight;
    let drawW = size;
    let drawH = size;
    if (aspect > 1) {
      drawW = size * aspect;
    } else {
      drawH = size / aspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const result = canvas.toDataURL('image/jpeg', 0.9);
    onApplyCrop(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="font-serif-ui text-lg font-bold text-stone-900">
            Adjust Square Crop
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport container */}
        <div className="my-5 flex flex-col items-center">
          <div
            className="relative w-60 h-60 rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-[#8C3A27] shadow-inner select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop target"
              crossOrigin="anonymous"
              draggable={false}
              className="max-w-none transition-transform pointer-events-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            {/* Guide overlay */}
            <div className="absolute inset-0 border border-white/40 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>
          </div>

          <p className="mt-2 text-xs text-stone-500 flex items-center gap-1">
            <Move className="w-3 h-3" /> Drag image to adjust position
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#8C3A27] cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-stone-400 shrink-0" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1C1917] text-white hover:bg-stone-800 flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
