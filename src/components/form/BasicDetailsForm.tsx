import React, { useRef, useState } from 'react';
import {
  CameraIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { BasicDetails } from '../../types/resume';
import { downscaleImage } from '../../utils/storage';
import { CropModal } from '../CropModal';
import { WhatsAppIcon } from '../templates/ClassicTemplate';

interface BasicDetailsFormProps {
  data: BasicDetails;
  onChange: (updated: Partial<BasicDetails>) => void;
}

export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  data,
  onChange,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const downscaled = await downscaleImage(file, 400, 0.9);
      onChange({ photoUrl: downscaled });
    } catch (err) {
      console.error('Failed to process image:', err);
    }
  };

  const handleAddAddressLine = () => {
    onChange({
      addressLines: [...(data.addressLines || []), ''],
    });
  };

  const handleUpdateAddressLine = (index: number, val: string) => {
    const next = [...(data.addressLines || [])];
    next[index] = val;
    onChange({ addressLines: next });
  };

  const handleRemoveAddressLine = (index: number) => {
    const next = data.addressLines.filter((_, i) => i !== index);
    onChange({ addressLines: next.length > 0 ? next : [''] });
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Photo Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
        <div className="relative">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-stone-300 shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-stone-200 border-2 border-stone-300 flex items-center justify-center text-stone-400">
              <UserIcon className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <label className="block text-xs font-semibold text-stone-700">
            Profile Photo (Square / Circle)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowUpTrayIcon className="w-3.5 h-3.5" />
              {data.photoUrl ? 'Replace photo' : 'Upload photo'}
            </button>

            {data.photoUrl && (
              <>
                <button
                  type="button"
                  onClick={() => setCropModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 shadow-2xs"
                >
                  <CameraIcon className="w-3.5 h-3.5" />
                  Adjust crop
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ photoUrl: null })}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-1 shadow-2xs"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  Remove
                </button>
              </>
            )}

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <p className="text-[11px] text-stone-500">
            Auto-resized for fast loading and clean A4 rendering.
          </p>
        </div>
      </div>

      {/* Crop Modal */}
      {data.photoUrl && (
        <CropModal
          imageUrl={data.photoUrl}
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          onApplyCrop={(croppedUrl) => onChange({ photoUrl: croppedUrl })}
        />
      )}

      {/* Full Name & Headline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="input-fullname"
            className="block text-xs font-semibold text-stone-800 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="input-fullname"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            onBlur={() => setNameTouched(true)}
            placeholder="e.g. Priya Sharma"
            className={`w-full px-3 py-2 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 ${
              nameTouched && !data.fullName.trim()
                ? 'border-red-400 focus:ring-red-300'
                : 'border-stone-200 focus:border-[#8C3A27] focus:ring-[#8C3A27]/20'
            }`}
          />
          {nameTouched && !data.fullName.trim() && (
            <p className="mt-1 text-[11px] text-red-600 font-medium">
              Full name is required.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="input-headline"
            className="block text-xs font-semibold text-stone-800 mb-1"
          >
            Professional Headline
          </label>
          <input
            id="input-headline"
            type="text"
            value={data.headline}
            onChange={(e) => onChange({ headline: e.target.value })}
            placeholder="e.g. Lead Frontend Architect"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-2 focus:ring-[#8C3A27]/20"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label
            htmlFor="input-email"
            className="block text-xs font-semibold text-stone-800 mb-1"
          >
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            id="input-email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            onBlur={() => setEmailTouched(true)}
            placeholder="e.g. priya.sharma@atelier.dev"
            className={`w-full px-3 py-2 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 ${
              emailTouched && data.email && !isValidEmail(data.email)
                ? 'border-red-400 focus:ring-red-300'
                : 'border-stone-200 focus:border-[#8C3A27] focus:ring-[#8C3A27]/20'
            }`}
          />
          {emailTouched && data.email && !isValidEmail(data.email) && (
            <p className="mt-1 text-[11px] text-red-600 font-medium">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label
            htmlFor="input-phone"
            className="block text-xs font-semibold text-stone-800 mb-1"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="input-phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            onBlur={() => setPhoneTouched(true)}
            placeholder="e.g. +91 98765 43210"
            className={`w-full px-3 py-2 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 ${
              phoneTouched && !data.phone.trim()
                ? 'border-red-400 focus:ring-red-300'
                : 'border-stone-200 focus:border-[#8C3A27] focus:ring-[#8C3A27]/20'
            }`}
          />
          {phoneTouched && !data.phone.trim() && (
            <p className="mt-1 text-[11px] text-red-600 font-medium">
              Phone number is required.
            </p>
          )}

          {/* WhatsApp Checkbox */}
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.useWhatsApp}
              onChange={(e) => onChange({ useWhatsApp: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
            />
            <span className="text-xs text-stone-700 flex items-center gap-1.5 font-medium">
              <WhatsAppIcon className="w-3.5 h-3.5" />
              I use WhatsApp on this number
            </span>
          </label>
        </div>
      </div>

      {/* Address with removable lines and + Add another line */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 mb-1">
          Address Lines
        </label>
        <div className="space-y-2">
          {data.addressLines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => handleUpdateAddressLine(idx, e.target.value)}
                placeholder={
                  idx === 0
                    ? 'e.g. Indiranagar 100ft Road, Stage 1'
                    : 'e.g. Bengaluru, Karnataka 560038'
                }
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-2 focus:ring-[#8C3A27]/20"
              />
              {data.addressLines.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAddressLine(idx)}
                  title="Remove address line"
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddAddressLine}
          className="mt-2 text-xs font-medium text-[#8C3A27] hover:underline flex items-center gap-1"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add another address line
        </button>
      </div>
    </div>
  );
};
