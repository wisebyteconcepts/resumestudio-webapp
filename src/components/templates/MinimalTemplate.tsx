import React from 'react';
import { CustomisationSettings, ResumeData } from '../../types/resume';
import { ResumeSectionItem } from './ResumeSectionsRenderer';
import { WhatsAppIcon } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
  settings: CustomisationSettings;
  headingFontClass: string;
  bodyFontClass: string;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const addressJoined = basic.addressLines.filter(Boolean).join(', ');

  return (
    <div className="p-9 text-stone-900 bg-white">
      {/* Header */}
      <header className="mb-6 pb-4 border-b border-stone-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1
              className={`text-[27px] font-light tracking-tight text-stone-950 ${headingFontClass}`}
            >
              {basic.fullName || 'Your Name'}
            </h1>
            {basic.headline && (
              <p
                className={`mt-1 text-[11px] uppercase tracking-widest text-stone-500 font-medium ${bodyFontClass}`}
              >
                {basic.headline}
              </p>
            )}

            {/* Quiet metadata line */}
            <div
              className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-stone-600 ${bodyFontClass}`}
            >
              {basic.email && <span>{basic.email}</span>}
              {basic.email && basic.phone && <span>·</span>}
              {basic.phone && (
                <span className="inline-flex items-center gap-1">
                  <span>{basic.phone}</span>
                  {basic.useWhatsApp && <WhatsAppIcon className="w-2.5 h-2.5" />}
                </span>
              )}
              {addressJoined && (basic.email || basic.phone) && <span>·</span>}
              {addressJoined && <span>{addressJoined}</span>}
            </div>
          </div>

          {basic.photoUrl && (
            <img
              src={basic.photoUrl}
              alt={basic.fullName}
              className="w-16 h-16 rounded-full object-cover grayscale contrast-110 border border-stone-200 shrink-0"
            />
          )}
        </div>
      </header>

      {/* Sections */}
      <main className="space-y-4">
        {settings.sectionOrder.map((sectionKey) => (
          <ResumeSectionItem
            key={sectionKey}
            sectionKey={sectionKey}
            data={data}
            settings={settings}
            headingFontClass={headingFontClass}
            bodyFontClass={bodyFontClass}
          />
        ))}
      </main>
    </div>
  );
};
