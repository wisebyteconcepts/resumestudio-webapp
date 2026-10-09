import React from 'react';
import { PassportDetails } from '../../types/resume';
import { DatePicker } from '../common/DatePicker';

interface PassportFormProps {
  passport: PassportDetails;
  onChange: (updated: Partial<PassportDetails>) => void;
}

export const PassportForm: React.FC<PassportFormProps> = ({
  passport,
  onChange,
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
        <div>
          <span className="text-xs font-bold text-stone-800 block">
            Add Passport Details
          </span>
          <span className="text-[11px] text-stone-500">
            Include international travel & identity identification details
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={passport.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C3A27]"></div>
        </label>
      </div>

      {passport.enabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Passport Number
            </label>
            <input
              type="text"
              value={passport.passportNumber}
              onChange={(e) => onChange({ passportNumber: e.target.value })}
              placeholder="e.g. Z4819203"
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Place of Issue
            </label>
            <input
              type="text"
              value={passport.placeOfIssue}
              onChange={(e) => onChange({ placeOfIssue: e.target.value })}
              placeholder="e.g. RPO Bengaluru"
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Date of Issue
            </label>
            <DatePicker
              value={passport.dateOfIssue}
              onChange={(val) => onChange({ dateOfIssue: val })}
              defaultPrecision="day"
              placeholder="e.g. 12 April 2018"
              minYear={1950}
              maxYear={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Expiry Date
            </label>
            <DatePicker
              value={passport.expiryDate}
              onChange={(val) => onChange({ expiryDate: val })}
              defaultPrecision="day"
              placeholder="e.g. 11 April 2028"
              minYear={1980}
              maxYear={new Date().getFullYear() + 20}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Issuing Country / Authority
            </label>
            <input
              type="text"
              value={passport.issuingAuthority}
              onChange={(e) => onChange({ issuingAuthority: e.target.value })}
              placeholder="e.g. Ministry of External Affairs, India"
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
