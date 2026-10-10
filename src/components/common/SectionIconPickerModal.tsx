import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CURATED_ICONS,
  DEFAULT_SECTION_ICONS,
  getHeroIconComponent,
} from './HeroIcon';
import { SectionKey } from '../../types/resume';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SectionIconPickerModalProps {
  sectionKey: SectionKey;
  currentIconName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  accentColor?: string;
}

const RECENT_ICONS_KEY = 'resume_studio_recent_icons';

export const SectionIconPickerModal: React.FC<SectionIconPickerModalProps> = ({
  sectionKey,
  currentIconName,
  isOpen,
  onClose,
  onSelectIcon,
  accentColor = '#8C3A27',
}) => {
  const [search, setSearch] = useState('');
  const [recentIcons, setRecentIcons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_ICONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CURATED_ICONS;
    return CURATED_ICONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [search]);

  const handlePick = (iconId: string) => {
    // Save to recents
    const updatedRecents = [iconId, ...recentIcons.filter((i) => i !== iconId)].slice(0, 6);
    setRecentIcons(updatedRecents);
    try {
      localStorage.setItem(RECENT_ICONS_KEY, JSON.stringify(updatedRecents));
    } catch {}

    onSelectIcon(iconId);
    onClose();
  };

  const handleReset = () => {
    const defaultIcon = DEFAULT_SECTION_ICONS[sectionKey] || 'DocumentTextIcon';
    onSelectIcon(defaultIcon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#FDFBF7] rounded-t-2xl sm:rounded-2xl border border-stone-200/90 shadow-2xl p-5 flex flex-col max-h-[85vh] sm:max-h-[600px] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose section icon"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
          <div>
            <h3 className="font-serif-ui text-base font-bold text-stone-900">
              Choose Section Icon
            </h3>
            <p className="text-xs text-stone-500">
              Select an icon for this section's header and resume title.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons (e.g. briefcase, cap, tools, flag)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recently Used (if not searching) */}
        {!search && recentIcons.length > 0 && (
          <div className="mt-3 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              Recently Used
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {recentIcons.map((recId) => {
                const IconComp = getHeroIconComponent(recId);
                const isSelected = currentIconName === recId;
                return (
                  <button
                    key={recId}
                    type="button"
                    onClick={() => handlePick(recId)}
                    title={recId.replace('Icon', '')}
                    className={`p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#8C3A27] bg-[#8C3A27]/10 text-[#8C3A27] shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: accentColor,
                            boxShadow: `0 0 0 1px ${accentColor}`,
                            color: accentColor,
                          }
                        : undefined
                    }
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Icon Results Count */}
        <div className="mt-3 mb-1 flex items-center justify-between text-[11px] text-stone-500">
          <span>
            {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} available
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[#8C3A27] hover:underline font-medium flex items-center gap-1"
          >
            <ArrowPathIcon className="w-3 h-3" />
            Reset to default
          </button>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 grid grid-cols-4 sm:grid-cols-5 gap-2 min-h-[220px]">
          {filteredIcons.map((item) => {
            const IconComp = getHeroIconComponent(item.id);
            const isSelected = currentIconName === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePick(item.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all group ${
                  isSelected
                    ? 'shadow-sm font-semibold'
                    : 'border-stone-200/80 bg-white hover:border-stone-400 hover:shadow-2xs'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                        backgroundColor: `${accentColor}12`,
                        color: accentColor,
                      }
                    : undefined
                }
              >
                <IconComp
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[#8C3A27]' : 'text-stone-700'
                  }`}
                  style={isSelected ? { color: accentColor } : undefined}
                />
                <span className="text-[10px] text-stone-600 line-clamp-1 text-center w-full">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-stone-200/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-200/60 hover:bg-stone-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
