import React from 'react';
import { PersonalInfo } from '../../types/resume';
import { DatePicker } from '../common/DatePicker';

interface PersonalInfoFormProps {
  personal: PersonalInfo;
  onChange: (updated: Partial<PersonalInfo>) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personal,
  onChange,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <p className="text-xs text-stone-500">
        All fields in this section are completely optional. Any fields left blank
        will never appear in your resume.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Date of Birth
          </label>
          <DatePicker
            value={personal.dob}
            onChange={(val) => onChange({ dob: val })}
            defaultPrecision="day"
            placeholder="e.g. 12 March 1998"
            minYear={1940}
            maxYear={new Date().getFullYear()}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Marital Status
          </label>
          <select
            value={personal.maritalStatus}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          >
            <option value="">Select (Optional)</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Nationality / Country
          </label>
          <input
            type="text"
            value={personal.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="e.g. India"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Father's Name
          </label>
          <input
            type="text"
            value={personal.fatherName}
            onChange={(e) => onChange({ fatherName: e.target.value })}
            placeholder="e.g. R. K. Sharma"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Mother's Name
          </label>
          <input
            type="text"
            value={personal.motherName}
            onChange={(e) => onChange({ motherName: e.target.value })}
            placeholder="e.g. Sunita Sharma"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Religion
          </label>
          <input
            type="text"
            value={personal.religion}
            onChange={(e) => onChange({ religion: e.target.value })}
            placeholder="e.g. Hindu / Christian / Islam / Other"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={personal.category}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="e.g. General / OBC / SC / ST"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
        </div>
      </div>
    </div>
  );
};
