import React from 'react';
import { CustomisationSettings, ResumeData } from '../../types/resume';
import { ResumeSectionItem } from './ResumeSectionsRenderer';
import { Mail, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon } from './ClassicTemplate';
import { hexToRgba } from '../../utils/colorUtils';

interface TemplateProps {
  data: ResumeData;
  settings: CustomisationSettings;
  headingFontClass: string;
  bodyFontClass: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const { accentColor } = settings;
  const addressJoined = basic.addressLines.filter(Boolean).join(', ');

  return (
    <div className="p-8 text-stone-900 bg-white relative overflow-hidden">
      {/* Decorative accent geometry */}
      <div
        className="absolute top-0 right-0 w-48 h-3.5 rounded-bl-xl"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <header className="mb-6 pb-4 border-b border-stone-200">
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className={`text-[10px] uppercase tracking-widest font-semibold ${bodyFontClass}`}
                style={{ color: accentColor }}
              >
                Curriculum Vitae
              </span>
            </div>

            <h1
              className={`text-[29px] font-extrabold tracking-tight text-stone-950 leading-tight ${headingFontClass}`}
            >
              {basic.fullName || 'Your Name'}
            </h1>

            {basic.headline && (
              <p
                className={`mt-1 text-[12px] font-semibold tracking-wide text-stone-700 ${bodyFontClass}`}
              >
                {basic.headline}
              </p>
            )}

            {/* Contact Pills / Blocks */}
            <div
              className={`mt-3 flex flex-wrap items-center gap-2 text-[9px] text-stone-700 ${bodyFontClass}`}
            >
              {basic.email && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                  <Mail className="w-3 h-3 text-stone-500" />
                  <span>{basic.email}</span>
                </span>
              )}
              {basic.phone && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                  <Phone className="w-3 h-3 text-stone-500" />
                  <span>{basic.phone}</span>
                  {basic.useWhatsApp && <WhatsAppIcon className="w-3 h-3" />}
                </span>
              )}
              {addressJoined && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{addressJoined}</span>
                </span>
              )}
            </div>
          </div>

          {basic.photoUrl && (
            <div className="relative shrink-0">
              <div
                className="absolute -inset-1 rounded-2xl"
                style={{ backgroundColor: hexToRgba(accentColor, 0.25) }}
              />
              <img
                src={basic.photoUrl}
                alt={basic.fullName}
                className="relative w-22 h-22 rounded-2xl object-cover border-2 shadow-sm"
                style={{ borderColor: accentColor }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Sections */}
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
