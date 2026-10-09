import React from 'react';
import { CustomisationSettings, ResumeData, SectionKey } from '../../types/resume';
import { ResumeSectionItem } from './ResumeSectionsRenderer';
import { Mail, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
  settings: CustomisationSettings;
  headingFontClass: string;
  bodyFontClass: string;
}

const RIGHT_COL_SECTIONS: Set<SectionKey> = new Set([
  'skills',
  'qualifications',
  'languages',
  'personal',
  'passport',
  'declaration',
]);

export const ProfessionalTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const { accentColor } = settings;
  const addressJoined = basic.addressLines.filter(Boolean).join(', ');

  const leftKeys = settings.sectionOrder.filter((k) => !RIGHT_COL_SECTIONS.has(k));
  const rightKeys = settings.sectionOrder.filter((k) => RIGHT_COL_SECTIONS.has(k));

  return (
    <div className="text-stone-900 bg-white">
      {/* Header Band in solid accent color */}
      <header
        className="px-8 py-6 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1">
            <h1
              className={`text-[26px] font-bold tracking-tight text-white ${headingFontClass}`}
            >
              {basic.fullName || 'Your Name'}
            </h1>
            {basic.headline && (
              <p
                className={`mt-1 text-[11.5px] font-medium tracking-wide uppercase text-white/90 ${bodyFontClass}`}
              >
                {basic.headline}
              </p>
            )}

            <div
              className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-white/85 ${bodyFontClass}`}
            >
              {basic.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-white/70" />
                  <span>{basic.email}</span>
                </span>
              )}
              {basic.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-white/70" />
                  <span>{basic.phone}</span>
                  {basic.useWhatsApp && (
                    <span className="bg-white/20 p-0.5 rounded">
                      <WhatsAppIcon className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </span>
              )}
              {addressJoined && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <span>{addressJoined}</span>
                </span>
              )}
            </div>
          </div>

          {basic.photoUrl && (
            <img
              src={basic.photoUrl}
              alt={basic.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/80 shadow-md shrink-0"
            />
          )}
        </div>
      </header>

      {/* Two-Column Body */}
      <div className="p-7 grid grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="col-span-7 space-y-4">
          {leftKeys.map((sectionKey) => (
            <ResumeSectionItem
              key={sectionKey}
              sectionKey={sectionKey}
              data={data}
              settings={settings}
              headingFontClass={headingFontClass}
              bodyFontClass={bodyFontClass}
            />
          ))}
        </div>

        {/* Right Column (5 cols) */}
        <div className="col-span-5 space-y-4 border-l border-stone-200 pl-5">
          {rightKeys.map((sectionKey) => (
            <ResumeSectionItem
              key={sectionKey}
              sectionKey={sectionKey}
              data={data}
              settings={settings}
              headingFontClass={headingFontClass}
              bodyFontClass={bodyFontClass}
              isCompact={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
