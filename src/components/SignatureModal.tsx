import React, { useRef, useState } from 'react';
import { Check, Eraser, Pen, Upload, X } from 'lucide-react';
import { downscaleImage } from '../utils/storage';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
}) => {
  const [tab, setTab] = useState<'draw' | 'upload'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1C1917';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resized = await downscaleImage(file, 400, 0.9);
      onSaveSignature(resized);
      onClose();
    } catch (err) {
      console.error('Failed to process signature upload:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="font-serif-ui text-lg font-bold text-stone-900">
            Add Digital Signature
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 my-4 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'draw'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'upload'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>

        {tab === 'draw' ? (
          <div>
            <div className="border border-stone-200 rounded-xl bg-stone-50 overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={380}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[140px] cursor-crosshair touch-none"
              />
              <div className="absolute bottom-2 left-3 text-[10px] text-stone-400 pointer-events-none">
                Sign above the line
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={handleClearCanvas}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 flex items-center gap-1.5"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
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
                  disabled={!hasDrawn}
                  onClick={handleSaveDrawn}
                  className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm ${
                    hasDrawn
                      ? 'bg-[#1C1917] text-white hover:bg-stone-800'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Signature
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <label className="border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-8 h-8 text-stone-400 mb-2" />
              <span className="text-xs font-medium text-stone-800">
                Click to browse signature image
              </span>
              <span className="text-[11px] text-stone-500 mt-1">
                PNG or JPEG with transparent or clean white background
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
