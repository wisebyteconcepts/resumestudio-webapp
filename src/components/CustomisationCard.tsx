import React, { useState } from 'react';
import {
  CheckIcon,
  PaintBrushIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  ACCENT_PRESETS,
  FONT_PAIRS,
  TEMPLATE_INFO,
} from '../data/sampleData';
import {
  CustomisationSettings,
  FontPair,
  TemplateId,
} from '../types/resume';
import { loadFontPairOnDemand } from '../utils/fontLoader';

interface CustomisationCardProps {
  settings: CustomisationSettings;
  onChange: (updated: Partial<CustomisationSettings>) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export const CustomisationCard: React.FC<CustomisationCardProps> = ({
  settings,
  onChange,
  isOpen: controlledIsOpen,
  onToggleOpen: controlledToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && controlledToggleOpen) {
      controlledToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const [customColor, setCustomColor] = useState(settings.accentColor);

  const handleColorChange = (hex: string) => {
    setCustomColor(hex);
    onChange({ accentColor: hex });
  };

  return (
    <div
      data-open={isOpen ? 'true' : 'false'}
      className={`bg-white rounded-2xl border transition-[box-shadow,border-color] duration-150 mb-4 shadow-2xs ${
        isOpen
          ? 'border-[#8C3A27]'
          : 'border-stone-200/90 hover:border-stone-300'
      }`}
      style={
        isOpen
          ? {
              borderColor: settings.accentColor,
              boxShadow: `0 0 0 1px ${settings.accentColor}, 0 2px 6px -1px rgba(0,0,0,0.06)`,
            }
          : undefined
      }
    >
      {/* Clickable Header Button: fixed height & identical content whether collapsed or expanded (no wobble) */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 select-none text-left rounded-2xl transition-colors hover:bg-stone-50/50 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-[#8C3A27] focus-visible:outline-offset-2"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Fixed 40x40 icon tile */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
            style={{ backgroundColor: settings.accentColor }}
          >
            <PaintBrushIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif-ui text-sm sm:text-base font-bold text-stone-900 leading-tight">
              Design & Typography
            </h2>
            <p className="text-xs text-stone-500 truncate leading-snug mt-0.5 max-w-md sm:max-w-xl">
              Template, accent colour, font pairing, and section headings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-stone-400">
          <span className="text-xs font-medium text-stone-500 hidden sm:inline">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? (
            <ChevronUpIcon className="w-4 h-4 text-stone-600" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
          )}
        </div>
      </button>

      {/* Collapsible Panel Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 pt-0 border-t border-stone-100 mt-1 space-y-6">
          {/* 1. Template Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Resume Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATE_INFO.map((tpl) => {
                const isSelected = settings.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onChange({ templateId: tpl.id as TemplateId })}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-[#8C3A27] bg-[#8C3A27]/5 text-stone-900 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: settings.accentColor,
                            boxShadow: `0 0 0 1px ${settings.accentColor}`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-serif-ui">
                        {tpl.name}
                      </span>
                      {isSelected && (
                        <CheckIcon
                          className="w-3.5 h-3.5"
                          style={{ color: settings.accentColor }}
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                      {tpl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Accent Colour Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Accent Colour
              </label>
              <span className="text-[11px] font-mono font-medium text-stone-500 uppercase">
                {settings.accentColor}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected =
                  settings.accentColor.toLowerCase() ===
                  preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleColorChange(preset.hex)}
                    title={`${preset.name} (${preset.hex})`}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: '#1c1917',
                            boxShadow: '0 0 0 1px #1c1917',
                          }
                        : undefined
                    }
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-[11px]">{preset.name}</span>
                  </button>
                );
              })}

              {/* Custom HEX Picker */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-dashed border-stone-300 bg-stone-50">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                  title="Pick a custom colour"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#8C3A27"
                  className="w-16 font-mono text-[11px] text-stone-700 bg-transparent border-0 focus:outline-none uppercase"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* 3. Typography Font Pairing */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Typography Pairing
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FONT_PAIRS.map((pair) => {
                const isSelected = settings.fontPair === pair.id;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => {
                      loadFontPairOnDemand(pair.id as FontPair);
                      onChange({ fontPair: pair.id as FontPair });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8C3A27] bg-[#8C3A27]/5 text-stone-900 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: settings.accentColor,
                            boxShadow: `0 0 0 1px ${settings.accentColor}`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{pair.label}</span>
                      {isSelected && (
                        <CheckIcon
                          className="w-3.5 h-3.5"
                          style={{ color: settings.accentColor }}
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      {pair.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Icon Toggle */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHeadingIcons}
                onChange={(e) => onChange({ showHeadingIcons: e.target.checked })}
                className="w-4 h-4 rounded text-[#8C3A27] focus:ring-[#8C3A27] border-stone-300 cursor-pointer"
              />
              <span className="text-xs font-medium text-stone-800">
                Show icons before section headings
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
