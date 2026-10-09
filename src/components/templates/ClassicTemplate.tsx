import React from 'react';
import { CustomisationSettings, ResumeData } from '../../types/resume';
import { ResumeSectionItem } from './ResumeSectionsRenderer';
import { Mail, MapPin, Phone } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: CustomisationSettings;
  headingFontClass: string;
  bodyFontClass: string;
}

export const WhatsAppIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block text-emerald-600 shrink-0 ${className}`}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.07 16.3C4.24 14.98 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67M9.13 7.08C8.94 7.08 8.63 7.15 8.37 7.43C8.11 7.71 7.38 8.39 7.38 9.77C7.38 11.15 8.39 12.48 8.52 12.67C8.66 12.86 10.5 15.86 13.41 17C15.83 17.94 16.32 17.72 16.85 17.67C17.38 17.62 18.55 16.98 18.79 16.29C19.03 15.6 19.03 15.01 18.96 14.88C18.89 14.76 18.71 14.69 18.44 14.55C18.17 14.42 16.85 13.77 16.6 13.68C16.36 13.59 16.18 13.54 16 13.82C15.82 14.1 15.31 14.69 15.15 14.88C15 15.06 14.84 15.08 14.57 14.95C14.3 14.81 13.43 14.52 12.39 13.6C11.58 12.88 11.04 12 10.88 11.72C10.72 11.45 10.86 11.3 11 11.16C11.12 11.04 11.27 10.85 11.41 10.69C11.55 10.53 11.6 10.41 11.69 10.23C11.78 10.05 11.73 9.89 11.67 9.77C11.6 9.65 11.09 8.41 10.88 7.89C10.67 7.39 10.45 7.46 10.29 7.45C10.14 7.44 9.96 7.44 9.78 7.44C9.59 7.44 9.3 7.51 9.13 7.08Z" />
  </svg>
);

export const ClassicTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  headingFontClass,
  bodyFontClass,
}) => {
  const { basic } = data;
  const addressJoined = basic.addressLines.filter(Boolean).join(', ');

  return (
    <div className="p-8 sm:p-10 text-stone-900 bg-white">
      {/* Centred Header */}
      <header className="text-center pb-5 mb-5 border-b border-stone-300">
        {basic.photoUrl && (
          <div className="mb-3 flex justify-center">
            <img
              src={basic.photoUrl}
              alt={basic.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 p-0.5 shadow-xs"
              style={{ borderColor: settings.accentColor }}
            />
          </div>
        )}

        <h1
          className={`text-[26px] font-bold tracking-tight text-stone-900 ${headingFontClass}`}
        >
          {basic.fullName || 'Your Name'}
        </h1>

        {basic.headline && (
          <p
            className={`mt-1 text-[12px] font-semibold tracking-wide uppercase ${bodyFontClass}`}
            style={{ color: settings.accentColor }}
          >
            {basic.headline}
          </p>
        )}

        {/* Contact Bar */}
        <div
          className={`mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9.5px] text-stone-600 ${bodyFontClass}`}
        >
          {basic.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-stone-400" />
              <span>{basic.email}</span>
            </span>
          )}

          {basic.email && basic.phone && <span className="text-stone-300">|</span>}

          {basic.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>{basic.phone}</span>
              {basic.useWhatsApp && (
                <span title="WhatsApp enabled" className="inline-flex items-center">
                  <WhatsAppIcon className="w-3 h-3 ml-0.5" />
                </span>
              )}
            </span>
          )}

          {addressJoined && (basic.email || basic.phone) && (
            <span className="text-stone-300">|</span>
          )}

          {addressJoined && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{addressJoined}</span>
            </span>
          )}
        </div>
      </header>

      {/* Render sections in specified user order */}
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
