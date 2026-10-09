import React, { useRef } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck,
  FilePlus,
  FileUp,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TEMPLATE_INFO } from '../data/sampleData';
import { CustomisationSettings, TemplateId } from '../types/resume';
import { TemplateThumbnail } from './TemplateThumbnails';

interface LandingHeroProps {
  settings: CustomisationSettings;
  hasSavedData: boolean;
  onSelectTemplate: (templateId: TemplateId) => void;
  onStartBlank: () => void;
  onStartWithSample: (templateId?: TemplateId) => void;
  onContinueEditing: () => void;
  onRestoreBackup: (file: File) => void;
  onOpenTemplate?: (templateId: TemplateId) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  settings,
  hasSavedData,
  onSelectTemplate,
  onStartBlank,
  onStartWithSample,
  onContinueEditing,
  onRestoreBackup,
  onOpenTemplate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTemplate =
    TEMPLATE_INFO.find((t) => t.id === settings.templateId) || TEMPLATE_INFO[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRestoreBackup(file);
      e.target.value = '';
    }
  };

  // Prefetch the editor bundle when hovering on start buttons
  const prefetchEditor = () => {
    import('./ResumeEditor').catch(() => {});
  };

  const handleCardDoubleClick = (tplId: TemplateId) => {
    onSelectTemplate(tplId);
    if (onOpenTemplate) {
      onOpenTemplate(tplId);
    } else {
      onStartWithSample(tplId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F4EE]">
      {/* 1. Slim Top Bar */}
      <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8C3A27] text-white flex items-center justify-center font-serif-ui font-black text-base shadow-xs select-none">
              R
            </div>
            <span className="font-serif-ui text-base font-bold tracking-tight text-stone-900">
              Resume Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5 text-stone-500" />
              <span>Restore from backup</span>
            </button>

            {hasSavedData && (
              <button
                type="button"
                onClick={onContinueEditing}
                onMouseEnter={prefetchEditor}
                className="px-4 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-medium hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Continue editing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hidden file input for backup restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 w-full flex-1 flex flex-col items-center">
        {/* 2. Headline Area (Clean & compact, not taking over the screen) */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Mono eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 border border-stone-300/80 text-stone-700 text-[11px] font-mono font-medium tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C3A27]" />
            A4 RESUME ATELIER
          </div>

          {/* Serif headline */}
          <h1 className="font-serif-ui text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-[1.18]">
            Pick a template to begin
          </h1>

          {/* Short one-liner */}
          <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg mx-auto">
            Tailored for 1-page A4 resumes. Everything runs locally in your browser.
          </p>

          {/* Two buttons under the heading */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {/* Primary button */}
            <button
              type="button"
              onClick={() => onStartWithSample(selectedTemplate.id)}
              onMouseEnter={prefetchEditor}
              className="px-6 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xs group cursor-pointer"
            >
              <span>Start with {selectedTemplate.name} →</span>
            </button>

            {/* Secondary button */}
            <button
              type="button"
              onClick={onStartBlank}
              onMouseEnter={prefetchEditor}
              className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-sm font-medium hover:bg-stone-50 hover:border-stone-400 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FilePlus className="w-4 h-4 text-stone-500" />
              <span>Start blank</span>
            </button>
          </div>
        </div>

        {/* 3. Template Grid (The hero of the page - 3x2 on desktop, 2x3 or 1-col on mobile) */}
        <div className="mt-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_INFO.map((tpl) => {
              const isSelected = settings.templateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl.id)}
                  onDoubleClick={() => handleCardDoubleClick(tpl.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative bg-white flex flex-col justify-between group select-none ${
                    isSelected
                      ? 'border-[#8C3A27] ring-2 ring-[#8C3A27] shadow-md scale-[1.01]'
                      : 'border-stone-200/90 hover:border-stone-300 hover:shadow-sm'
                  }`}
                >
                  {/* Lightweight Static Visual Thumbnail (accurate SVG layout preview) */}
                  <div className="w-full h-48 rounded-xl bg-stone-50/80 border border-stone-200/70 p-2 overflow-hidden flex items-center justify-center mb-3 group-hover:bg-stone-100/50 transition-colors">
                    <div className="w-28 h-40 shadow-xs ring-1 ring-black/5 rounded-xs overflow-hidden transition-transform duration-200 group-hover:scale-105">
                      <TemplateThumbnail
                        templateId={tpl.id}
                        accentColor={isSelected ? settings.accentColor : '#78716c'}
                      />
                    </div>
                  </div>

                  {/* Card Content & Meta */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-ui text-base font-bold text-stone-900 group-hover:text-[#8C3A27] transition-colors truncate">
                          {tpl.name}
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium shrink-0">
                          {tpl.badge}
                        </span>
                      </div>

                      {/* 1-line tag */}
                      <p className="text-xs text-stone-500 font-medium mt-1 truncate">
                        {tpl.tag}
                      </p>
                    </div>

                    {/* Visual Selection Indicator (Radio / Checkmark circle) */}
                    <div className="shrink-0 mt-0.5">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#8C3A27] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-stone-300 group-hover:border-stone-400 flex items-center justify-center" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-stone-400">
            Click to select · Double-click any template to start immediately
          </p>
        </div>
      </main>

      {/* 4. Trust Strip at the bottom: 3 badges with icons */}
      <footer className="border-t border-stone-200/80 bg-white/70 backdrop-blur-xs py-5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-y-3 gap-x-6 text-xs text-stone-600">
          {/* Badge 1 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-stone-900">100% Client-Side</span>
              <span className="text-stone-400 mx-1.5">·</span>
              <span>Your data never leaves your device</span>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-stone-900">True A4 Auto-Fit</span>
              <span className="text-stone-400 mx-1.5">·</span>
              <span>Always exports to exactly 1 page</span>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-stone-900">Print & ATS-Ready</span>
              <span className="text-stone-400 mx-1.5">·</span>
              <span>Crisp vector text & clean structure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
