import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif-ui text-lg font-bold text-stone-900 mt-2">
          Clear all resume data?
        </h3>
        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
          This will permanently remove all your entered fields, work experience,
          and uploads from this browser. You can export a JSON backup first if
          you want to save your work.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Yes, Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
};
