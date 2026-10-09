import React from 'react';
import { Download, FileText, X } from 'lucide-react';

interface StartBlankConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStartBlank: () => void;
  onDownloadBackupFirst: () => void;
}

export const StartBlankConfirmModal: React.FC<StartBlankConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmStartBlank,
  onDownloadBackupFirst,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-ui text-base font-bold text-stone-900 leading-tight">
                You have an existing draft
              </h3>
              <p className="text-xs text-stone-500">
                Replace it with a blank resume?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 my-4 leading-relaxed">
          You have an existing draft. Replace it with a blank resume? You can download a backup copy first so you won't lose your previous entries.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmStartBlank}
            className="px-4 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 text-center shadow-xs"
          >
            Start blank
          </button>
          <button
            type="button"
            onClick={() => {
              onDownloadBackupFirst();
              onConfirmStartBlank();
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 hover:bg-stone-50 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Download backup first
          </button>
        </div>
      </div>
    </div>
  );
};
