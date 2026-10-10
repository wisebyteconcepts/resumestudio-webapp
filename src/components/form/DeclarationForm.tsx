import React, { useState } from 'react';
import {
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
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

  const isDateVisible = !declaration.hideDate;
  const isPlaceVisible = !declaration.hidePlace;
  const isSigVisible = !declaration.hideSignature;

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
            className="text-[11px] text-[#8C3A27] hover:underline flex items-center gap-1 font-medium cursor-pointer"
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

      {/* Date & Place with Individual Visibility Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date Field Container */}
        <div
          className={`p-3 rounded-xl border transition-colors ${
            !isDateVisible
              ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
              : 'bg-white border-stone-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Date
            </label>
            <button
              type="button"
              onClick={() => onChange({ hideDate: isDateVisible })}
              className={`p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer ${
                !isDateVisible ? 'text-amber-700 hover:text-amber-800' : ''
              }`}
              title={
                isDateVisible
                  ? 'Hide date on resume (keeps saved value)'
                  : 'Show date on resume'
              }
              aria-label={
                isDateVisible ? 'Hide date on resume' : 'Show date on resume'
              }
            >
              {isDateVisible ? (
                <EyeIcon className="w-3.5 h-3.5" />
              ) : (
                <EyeSlashIcon className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
          </div>
          <DatePicker
            value={declaration.date}
            onChange={(val) => onChange({ date: val })}
            defaultPrecision="day"
            placeholder="Select date"
            minYear={1980}
            maxYear={new Date().getFullYear() + 2}
            disabled={!isDateVisible}
          />
          {!isDateVisible && (
            <p className="text-[10px] text-amber-700 font-medium mt-1">
              Hidden on resume
            </p>
          )}
        </div>

        {/* Place Field Container */}
        <div
          className={`p-3 rounded-xl border transition-colors ${
            !isPlaceVisible
              ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
              : 'bg-white border-stone-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Place
            </label>
            <button
              type="button"
              onClick={() => onChange({ hidePlace: isPlaceVisible })}
              className={`p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer ${
                !isPlaceVisible ? 'text-amber-700 hover:text-amber-800' : ''
              }`}
              title={
                isPlaceVisible
                  ? 'Hide place on resume (keeps saved value)'
                  : 'Show place on resume'
              }
              aria-label={
                isPlaceVisible ? 'Hide place on resume' : 'Show place on resume'
              }
            >
              {isPlaceVisible ? (
                <EyeIcon className="w-3.5 h-3.5" />
              ) : (
                <EyeSlashIcon className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
          </div>
          <input
            type="text"
            value={declaration.place}
            onChange={(e) => onChange({ place: e.target.value })}
            placeholder="e.g. Bengaluru"
            disabled={!isPlaceVisible}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27] disabled:bg-stone-100 disabled:text-stone-400"
          />
          {!isPlaceVisible && (
            <p className="text-[10px] text-amber-700 font-medium mt-1">
              Hidden on resume
            </p>
          )}
        </div>
      </div>

      {/* Signature upload/draw with preview, remove, and visibility toggle */}
      <div
        className={`p-4 rounded-xl border transition-colors space-y-2 ${
          !isSigVisible
            ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
            : 'bg-stone-50/50 border-stone-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-stone-700">
            Digital Signature
          </label>
          <button
            type="button"
            onClick={() => onChange({ hideSignature: isSigVisible })}
            className={`p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer ${
              !isSigVisible ? 'text-amber-700 hover:text-amber-800' : ''
            }`}
            title={
              isSigVisible
                ? 'Hide signature on resume (keeps uploaded/drawn signature)'
                : 'Show signature on resume'
            }
            aria-label={
              isSigVisible
                ? 'Hide signature on resume'
                : 'Show signature on resume'
            }
          >
            {isSigVisible ? (
              <EyeIcon className="w-3.5 h-3.5" />
            ) : (
              <EyeSlashIcon className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>
        </div>

        <p className="text-[11px] text-stone-500">
          Will be rendered directly above your name and place on the printable resume.
        </p>

        {!isSigVisible && (
          <p className="text-[10px] text-amber-700 font-medium">
            Hidden on resume (name line remains)
          </p>
        )}

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
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                Change signature
              </button>

              <button
                type="button"
                onClick={() => onChange({ signatureUrl: null })}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
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
            className="px-4 py-2 rounded-xl border border-dashed border-stone-300 hover:border-stone-400 bg-white text-xs font-medium text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
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
