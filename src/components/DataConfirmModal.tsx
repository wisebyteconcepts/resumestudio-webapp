import React, { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Download,
  FileText,
  RotateCcw,
  Sliders,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

export type DataActionType =
  | 'load-sample'
  | 'start-blank'
  | 'reload-saved'
  | 'reset-design'
  | 'clear-everything';

interface DataConfirmModalProps {
  isOpen: boolean;
  actionType: DataActionType | null;
  onClose: () => void;
  onConfirm: () => void;
  onDownloadBackupFirst: () => void;
}

export const DataConfirmModal: React.FC<DataConfirmModalProps> = ({
  isOpen,
  actionType,
  onClose,
  onConfirm,
  onDownloadBackupFirst,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button for safety
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !actionType) return null;

  const getConfig = () => {
    switch (actionType) {
      case 'load-sample':
        return {
          title: 'Load sample data?',
          description:
            "This will replace your current resume entries with Priya Sharma's sample resume. You can download a backup first so you won't lose your work.",
          confirmText: 'Load sample data',
          confirmBtnClass:
            'bg-[#1C1917] text-white hover:bg-stone-800 shadow-xs',
          icon: <Sparkles className="w-5 h-5" />,
          iconBg: 'bg-amber-50 text-amber-600',
        };
      case 'start-blank':
        return {
          title: 'Start blank resume?',
          description:
            'This will empty all resume content fields for a fresh start. Your layout and template styling will be kept. You can download a backup copy first.',
          confirmText: 'Start blank',
          confirmBtnClass:
            'bg-[#1C1917] text-white hover:bg-stone-800 shadow-xs',
          icon: <FileText className="w-5 h-5" />,
          iconBg: 'bg-stone-100 text-stone-700',
        };
      case 'reload-saved':
        return {
          title: 'Reload last saved draft?',
          description:
            'This will revert any unsaved edits and reload the resume saved in your browser storage. You can download a backup copy first.',
          confirmText: 'Reload last saved',
          confirmBtnClass:
            'bg-[#1C1917] text-white hover:bg-stone-800 shadow-xs',
          icon: <RotateCcw className="w-5 h-5" />,
          iconBg: 'bg-stone-100 text-stone-700',
        };
      case 'reset-design':
        return {
          title: 'Reset design settings?',
          description:
            'This will reset colors, fonts, margins, spacing, section order, and icons back to default settings. All your entered resume text, jobs, and personal details will be kept.',
          confirmText: 'Reset design only',
          confirmBtnClass:
            'bg-[#1C1917] text-white hover:bg-stone-800 shadow-xs',
          icon: <Sliders className="w-5 h-5" />,
          iconBg: 'bg-stone-100 text-stone-700',
        };
      case 'clear-everything':
        return {
          title: 'Clear everything?',
          description:
            'This will permanently remove all your resume entries, work experience, uploads, and reset design settings. We strongly recommend downloading a backup first.',
          confirmText: 'Yes, clear everything',
          confirmBtnClass: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
          icon: <Trash2 className="w-5 h-5" />,
          iconBg: 'bg-red-50 text-red-600',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}
            >
              {config.icon}
            </div>
            <div>
              <h3
                id="data-modal-title"
                className="font-serif-ui text-base font-bold text-stone-900 leading-tight"
              >
                {config.title}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Action requires confirmation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 my-4 leading-relaxed">
          {config.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-stone-100">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 text-center transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onDownloadBackupFirst();
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Download backup first</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer ${config.confirmBtnClass}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
