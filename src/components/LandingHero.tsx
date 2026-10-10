import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
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
  onStartBlank: (templateId?: TemplateId) => void;
  onStartWithSample: (templateId?: TemplateId) => void;
  onContinueEditing: (templateId?: TemplateId) => void;
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
  // Default start option for new resumes is blank
  const [startOption, setStartOption] = useState<'blank' | 'sample'>('blank');

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

  // Action when user clicks "Use this template →" or "Apply to my resume →"
  const handleUseTemplate = (tplId: TemplateId) => {
    onSelectTemplate(tplId);
    if (hasSavedData) {
      // Keep existing data and apply template
      onContinueEditing(tplId);
    } else {
      // Use currently chosen start option (blank by default)
      if (startOption === 'sample') {
        onStartWithSample(tplId);
      } else {
        onStartBlank(tplId);
      }
    }
  };

  const handleCardDoubleClick = (tplId: TemplateId) => {
    handleUseTemplate(tplId);
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
              className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
            >
              <FileUp className="w-3.5 h-3.5 text-stone-500" />
              <span>Restore from backup</span>
            </button>

            {hasSavedData && (
              <button
                type="button"
                onClick={() => onContinueEditing(selectedTemplate.id)}
                onMouseEnter={prefetchEditor}
                className="px-4 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-medium hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
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
        {/* 2. Headline Area */}
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

          {/* Start mode options & primary CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            {!hasSavedData && (
              <div className="inline-flex items-center p-1 bg-stone-200/80 rounded-xl border border-stone-300/70 text-xs">
                <button
                  type="button"
                  onClick={() => setStartOption('blank')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    startOption === 'blank'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FilePlus className="w-3.5 h-3.5 text-stone-500" />
                  <span>Start blank (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStartOption('sample')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    startOption === 'sample'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>With sample data</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleUseTemplate(selectedTemplate.id)}
                onMouseEnter={prefetchEditor}
                className="px-6 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xs group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
              >
                <span>
                  {hasSavedData
                    ? `Apply ${selectedTemplate.name} to my resume →`
                    : startOption === 'sample'
                    ? `Start with ${selectedTemplate.name} (Sample) →`
                    : `Start blank with ${selectedTemplate.name} →`}
                </span>
              </button>

              {hasSavedData && (
                <button
                  type="button"
                  onClick={() => onContinueEditing(selectedTemplate.id)}
                  onMouseEnter={prefetchEditor}
                  className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-sm font-medium hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
                >
                  <span>Continue with current template</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Template Grid (The hero of the page) */}
        <div className="mt-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_INFO.map((tpl) => {
              const isSelected = settings.templateId === tpl.id;
              const actionLabel = hasSavedData
                ? 'Apply to my resume →'
                : 'Use this template →';

              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl.id)}
                  onDoubleClick={() => handleCardDoubleClick(tpl.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative bg-white flex flex-col justify-between group select-none ${
                    isSelected
                      ? 'border-[#8C3A27] shadow-md'
                      : 'border-stone-200/90 hover:border-stone-300 hover:shadow-xs'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: '#8C3A27',
                          boxShadow: '0 0 0 1px #8C3A27, 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }
                      : undefined
                  }
                >
                  {/* Lightweight Static Visual Thumbnail (accurate SVG layout preview) */}
                  <div className="relative w-full h-48 rounded-xl bg-stone-50/80 border border-stone-200/70 p-2 overflow-hidden flex items-center justify-center mb-3">
                    <div className="w-28 h-40 shadow-xs ring-1 ring-black/5 rounded-xs overflow-hidden transition-transform duration-200 group-hover:scale-105">
                      <TemplateThumbnail
                        templateId={tpl.id}
                        accentColor={isSelected ? settings.accentColor : '#78716c'}
                      />
                    </div>

                    {/* Centred scrim + overlay button on desktop hover / focus-within (fades & slides up in 150 ms) */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 hidden sm:flex items-center justify-center pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto z-10">
                      <button
                        type="button"
                        aria-label={
                          hasSavedData
                            ? `Apply ${tpl.name} template to my resume`
                            : `Use ${tpl.name} template`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(tpl.id);
                        }}
                        className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-all duration-150 px-4 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-xs shadow-lg hover:bg-stone-50 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27] focus-visible:ring-offset-2 flex items-center gap-1.5 cursor-pointer pointer-events-auto"
                      >
                        <span>{actionLabel}</span>
                      </button>
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

                  {/* Touch / Mobile device persistent button: minimum 44px touch target */}
                  <div className="sm:hidden mt-3 pt-2.5 border-t border-stone-100">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(tpl.id);
                        }}
                        aria-label={
                          hasSavedData
                            ? `Apply ${tpl.name} template to my resume`
                            : `Use ${tpl.name} template`
                        }
                        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1C1917] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
                      >
                        <span>{actionLabel}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(tpl.id);
                        }}
                        aria-label={`Use ${tpl.name} template`}
                        className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 font-medium text-xs flex items-center justify-center gap-1 hover:bg-stone-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
                      >
                        <span>{hasSavedData ? 'Apply →' : 'Use →'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-stone-400">
            Click to select · Hover to start immediately with chosen template
          </p>
        </div>
      </main>

      {/* Sticky bottom "Continue →" bar as an alternative path */}
      <div className="sticky bottom-0 z-30 bg-[#F7F4EE]/95 backdrop-blur-md border-t border-stone-200/90 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Selected template:
            </span>
            <span className="font-serif-ui text-sm font-bold text-stone-900 truncate">
              {selectedTemplate.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700 font-medium shrink-0">
              {selectedTemplate.badge}
            </span>
            {hasSavedData && (
              <span className="hidden md:inline-flex text-[11px] text-stone-500 font-normal">
                · Existing resume data will be preserved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleUseTemplate(selectedTemplate.id)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1C1917] text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
            >
              <span>
                {hasSavedData
                  ? `Apply to my resume & Continue →`
                  : `Continue to editor →`}
              </span>
            </button>
          </div>
        </div>
      </div>

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
