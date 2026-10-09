import React from 'react';
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Printer,
  X,
} from 'lucide-react';

interface PdfBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadImageBased: () => void;
  onRetryPrintWindow: () => void;
  isGeneratingFallback: boolean;
}

export const PdfBlockedModal: React.FC<PdfBlockedModalProps> = ({
  isOpen,
  onClose,
  onDownloadImageBased,
  onRetryPrintWindow,
  isGeneratingFallback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-start justify-between pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif-ui text-lg font-bold text-stone-900 mt-2">
          Your browser blocked the PDF window
        </h3>

        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
          Allow popups for this site to open the real selectable-text print window,
          or use direct file download below.
        </p>

        <div className="my-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5 text-[#8C3A27]" />
            Print Dialog Settings:
          </div>
          <p className="text-[11px] text-stone-600 leading-normal">
            Destination: <strong>Save as PDF</strong> · Paper: <strong>A4</strong> · Margins: <strong>None</strong> · Options: <strong>Background graphics ON</strong>
          </p>
        </div>

        <div className="space-y-2 mt-5">
          <button
            type="button"
            disabled={isGeneratingFallback}
            onClick={() => {
              onDownloadImageBased();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-75"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>
              {isGeneratingFallback
                ? 'Preparing PDF...'
                : 'Download PDF (quick, image-based)'}
            </span>
          </button>

          <button
            type="button"
            onClick={onRetryPrintWindow}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-stone-500" />
            <span>Retry Opening Print Window</span>
          </button>
        </div>
      </div>
    </div>
  );
};
