import React from 'react';
import { CustomisationSettings, ResumeData, SectionKey } from '../../types/resume';
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

const SIDEBAR_SECTIONS: Set<SectionKey> = new Set([
  'skills',
  'languages',
  'personal',
  'passport',
]);

export const ModernSidebarTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const { accentColor } = settings;

  // Split section order into sidebar sections and main body sections according to user's order
  const sidebarOrderedKeys = settings.sectionOrder.filter((k) =>
    SIDEBAR_SECTIONS.has(k)
  );
  const mainOrderedKeys = settings.sectionOrder.filter(
    (k) => !SIDEBAR_SECTIONS.has(k)
  );

  return (
    <div className="min-h-full flex text-stone-900 bg-white">
      {/* Left Sidebar (~33% width) with subtle tinted accent background */}
      <aside
        className="w-[34%] p-6 flex flex-col justify-between border-r border-stone-200"
        style={{
          backgroundColor: hexToRgba(accentColor, 0.06),
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        <div>
          {/* Profile Photo */}
          {basic.photoUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={basic.photoUrl}
                alt={basic.fullName}
                className="w-24 h-24 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: accentColor }}
              />
            </div>
          )}

          {/* Contact Details Block */}
          <div className="mb-6 space-y-2.5 pb-4 border-b border-stone-200/80">
            <h2
              className={`text-[10.5px] font-bold uppercase tracking-wider text-stone-900 ${headingFontClass}`}
            >
              Contact
            </h2>

            <div
              className={`space-y-2 text-[9px] text-stone-700 leading-snug ${bodyFontClass}`}
            >
              {basic.email && (
                <div className="flex items-start gap-1.5">
                  <Mail
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <span className="break-all">{basic.email}</span>
                </div>
              )}

              {basic.phone && (
                <div className="flex items-start gap-1.5">
                  <Phone
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <span className="flex items-center gap-1">
                    <span>{basic.phone}</span>
                    {basic.useWhatsApp && (
                      <span title="WhatsApp enabled">
                        <WhatsAppIcon className="w-3 h-3" />
                      </span>
                    )}
                  </span>
                </div>
              )}

              {basic.addressLines && basic.addressLines.some((l) => l.trim()) && (
                <div className="flex items-start gap-1.5">
                  <MapPin
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <span>
                    {basic.addressLines.filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Sections */}
          <div className="space-y-4">
            {sidebarOrderedKeys.map((sectionKey) => (
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
      </aside>

      {/* Main Right Content (~66% width) */}
      <main className="w-[66%] p-7 flex flex-col justify-between">
        <div>
          {/* Header */}
          <header className="mb-5 pb-3 border-b border-stone-200">
            <h1
              className={`text-[25px] font-bold tracking-tight text-stone-900 ${headingFontClass}`}
            >
              {basic.fullName || 'Your Name'}
            </h1>
            {basic.headline && (
              <p
                className={`mt-1 text-[11.5px] font-semibold tracking-wide uppercase ${bodyFontClass}`}
                style={{ color: accentColor }}
              >
                {basic.headline}
              </p>
            )}
          </header>

          {/* Main Body Sections */}
          <div className="space-y-4">
            {mainOrderedKeys.map((sectionKey) => (
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
        </div>
      </main>
    </div>
  );
};
