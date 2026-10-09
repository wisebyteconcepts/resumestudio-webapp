import React, { useState } from 'react';
import { ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { DeclarationDetails } from '../../types/resume';
import { SignatureModal } from '../SignatureModal';
import { DatePicker } from '../common/DatePicker';

interface DeclarationFormProps {
  declaration: DeclarationDetails;
  onChange: (updated: Partial<DeclarationDetails>) => void;
}

const DEFAULT_DECLARATION_TEXT =
  'I hereby declare that all the information furnished above is true and correct to the best of my knowledge and belief.';

export const DeclarationForm: React.FC<DeclarationFormProps> = ({
  declaration,
  onChange,
}) => {
  const [sigModalOpen, setSigModalOpen] = useState(false);

  const handleResetDefault = () => {
    onChange({ text: DEFAULT_DECLARATION_TEXT });
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Declaration Text */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-stone-700">
            Statement of Declaration
          </label>
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-[11px] text-[#8C3A27] hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowPathIcon className="w-3 h-3" />
            Reset to default
          </button>
        </div>
        <textarea
          rows={3}
          value={declaration.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
        />
      </div>

      {/* Date & Place */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Date
          </label>
          <DatePicker
            value={declaration.date}
            onChange={(val) => onChange({ date: val })}
            defaultPrecision="day"
            placeholder="Select date"
            minYear={1980}
            maxYear={new Date().getFullYear() + 2}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Place
          </label>
          <input
            type="text"
            value={declaration.place}
            onChange={(e) => onChange({ place: e.target.value })}
            placeholder="e.g. Bengaluru"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>
      </div>

      {/* Signature upload/draw with preview and remove */}
      <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
        <label className="block text-xs font-semibold text-stone-700">
          Digital Signature
        </label>
        <p className="text-[11px] text-stone-500">
          Will be rendered directly above your name and place on the printable resume.
        </p>

        {declaration.signatureUrl ? (
          <div className="flex items-center gap-4 pt-1">
            <div className="h-16 px-4 bg-white rounded-lg border border-stone-200 flex items-center justify-center shadow-2xs">
              <img
                src={declaration.signatureUrl}
                alt="Signature preview"
                className="max-h-12 max-w-[140px] object-contain"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSigModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                Change signature
              </button>

              <button
                type="button"
                onClick={() => onChange({ signatureUrl: null })}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-1"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSigModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-dashed border-stone-300 hover:border-stone-400 bg-white text-xs font-medium text-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <PencilSquareIcon className="w-3.5 h-3.5 text-[#8C3A27]" />
            Draw or Upload Signature
          </button>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={sigModalOpen}
        onClose={() => setSigModalOpen(false)}
        onSaveSignature={(dataUrl) => onChange({ signatureUrl: dataUrl })}
      />
    </div>
  );
};
