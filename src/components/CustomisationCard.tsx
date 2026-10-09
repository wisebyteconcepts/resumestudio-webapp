import React, { useState } from 'react';
import {
  CheckIcon,
  PaintBrushIcon,
  SparklesIcon,
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
}

export const CustomisationCard: React.FC<CustomisationCardProps> = ({
  settings,
  onChange,
}) => {
  const [customColor, setCustomColor] = useState(settings.accentColor);

  const selectedTemplate =
    TEMPLATE_INFO.find((t) => t.id === settings.templateId) || TEMPLATE_INFO[0];

  const handleColorChange = (hex: string) => {
    setCustomColor(hex);
    onChange({ accentColor: hex });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8C3A27]/10 text-[#8C3A27] flex items-center justify-center">
            <PaintBrushIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif-ui text-base font-bold text-stone-900 leading-tight">
              Design & Typography
            </h2>
            <p className="text-xs text-stone-500">
              Customise visual template, accent colour palette, and font pairing
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-6">
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
                  onClick={() => onChange({ templateId: tpl.id })}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#8C3A27] bg-[#8C3A27]/5 text-stone-900 shadow-xs ring-1 ring-[#8C3A27]'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif-ui">
                      {tpl.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#8C3A27] text-white flex items-center justify-center text-[10px]">
                        <CheckIcon className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {/* One-line description of the selected template */}
          <div className="mt-2.5 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200/60 text-xs text-stone-600 flex items-center gap-2">
            <span className="font-medium text-stone-900">
              {selectedTemplate.name}:
            </span>
            <span>{selectedTemplate.desc}</span>
          </div>
        </div>

        {/* 2. Accent Colour */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Accent Colour
            </label>
            <span className="text-xs font-mono text-stone-500">
              Current: <strong className="text-stone-800">{settings.accentColor}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {ACCENT_PRESETS.map((preset) => {
              const isSelected =
                settings.accentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => handleColorChange(preset.hex)}
                  title={preset.name}
                  className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center shadow-xs relative ${
                    isSelected ? 'ring-2 ring-offset-2 ring-stone-900 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && <CheckIcon className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}

            {/* Custom color picker swatch */}
            <label
              className="relative w-8 h-8 rounded-full border border-stone-300 shadow-xs cursor-pointer flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
              title="Pick custom colour"
              style={{ backgroundColor: customColor }}
            >
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <span className="sr-only">Custom colour</span>
            </label>
          </div>
        </div>

        {/* 3. Font Pairing */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Font Pairing
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
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#8C3A27] bg-[#8C3A27]/5 text-stone-900 ring-1 ring-[#8C3A27]'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{pair.label}</span>
                    {isSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-[#8C3A27]" />
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
    </div>
  );
};
