import React from 'react';
import { CustomisationSettings, ResumeData } from '../../types/resume';
import { ResumeSectionItem } from './ResumeSectionsRenderer';
import { Mail, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
  settings: CustomisationSettings;
  headingFontClass: string;
  bodyFontClass: string;
}

export const CompactTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const { accentColor } = settings;
  const addressJoined = basic.addressLines.filter(Boolean).join(', ');

  return (
    <div className="p-6 text-stone-900 bg-white leading-tight">
      {/* Dense Header */}
      <header className="mb-3.5 pb-2.5 border-b-2 flex items-center justify-between gap-4" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-3">
          {basic.photoUrl && (
            <img
              src={basic.photoUrl}
              alt={basic.fullName}
              className="w-13 h-13 rounded-md object-cover border shrink-0"
              style={{ borderColor: accentColor }}
            />
          )}

          <div>
            <h1
              className={`text-[22px] font-bold tracking-tight text-stone-900 leading-none ${headingFontClass}`}
            >
              {basic.fullName || 'Your Name'}
            </h1>
            {basic.headline && (
              <p
                className={`mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider ${bodyFontClass}`}
                style={{ color: accentColor }}
              >
                {basic.headline}
              </p>
            )}
          </div>
        </div>

        {/* Contact info compact right block */}
        <div
          className={`text-right space-y-0.5 text-[8.5px] text-stone-600 ${bodyFontClass}`}
        >
          {basic.email && (
            <div className="flex items-center justify-end gap-1">
              <span>{basic.email}</span>
              <Mail className="w-2.5 h-2.5 text-stone-400" />
            </div>
          )}
          {basic.phone && (
            <div className="flex items-center justify-end gap-1">
              <span>{basic.phone}</span>
              {basic.useWhatsApp && <WhatsAppIcon className="w-2.5 h-2.5" />}
              <Phone className="w-2.5 h-2.5 text-stone-400" />
            </div>
          )}
          {addressJoined && (
            <div className="flex items-center justify-end gap-1">
              <span>{addressJoined}</span>
              <MapPin className="w-2.5 h-2.5 text-stone-400" />
            </div>
          )}
        </div>
      </header>

      {/* Dense Sections */}
      <main className="space-y-2.5">
        {settings.sectionOrder.map((sectionKey) => (
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
      </main>
    </div>
  );
};
