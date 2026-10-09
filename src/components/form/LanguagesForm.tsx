import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LanguagesFormProps {
  languages: string[];
  onChange: (updatedLangs: string[]) => void;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({
  languages,
  onChange,
}) => {
  const [newLangText, setNewLangText] = useState('');

  const handleAdd = () => {
    const trimmed = newLangText.trim();
    if (!trimmed) return;
    onChange([...languages, trimmed]);
    setNewLangText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newLangText}
          onChange={(e) => setNewLangText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. English (Fluent), Hindi (Native), German (A2)"
          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newLangText.trim()}
          className="px-3.5 py-1.5 rounded-lg bg-[#8C3A27] text-white text-xs font-semibold hover:bg-[#722F1F] disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {languages.map((lang, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800 shadow-2xs"
          >
            <span>{lang}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-stone-400 hover:text-red-600 rounded"
              title="Remove language"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
