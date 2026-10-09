import React from 'react';
import { SectionKey, TemplateId } from '../../types/resume';
import { hexToRgba } from '../../utils/colorUtils';
import { DEFAULT_SECTION_ICONS, getHeroIconComponent } from '../common/HeroIcon';

interface SectionHeadingProps {
  sectionKey: SectionKey;
  title: string;
  templateId: TemplateId;
  accentColor: string;
  showIcon: boolean;
  headingFontClass: string;
  customIconName?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  sectionKey,
  title,
  templateId,
  accentColor,
  showIcon,
  headingFontClass,
  customIconName,
  className = '',
}) => {
  const iconName = customIconName || DEFAULT_SECTION_ICONS[sectionKey] || 'DocumentTextIcon';
  const IconComponent = getHeroIconComponent(iconName);

  if (templateId === 'minimal') {
    return (
      <div className={`mb-3 pb-1 border-b border-stone-200 ${className}`}>
        <div className="flex items-center gap-1.5">
          {showIcon && (
            <IconComponent className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
          )}
          <h2
            className={`text-[11px] font-bold uppercase tracking-[0.2em] text-stone-800 ${headingFontClass}`}
          >
            {title}
          </h2>
        </div>
      </div>
    );
  }

  if (templateId === 'classic') {
    return (
      <div className={`mb-3 pb-1.5 border-b border-stone-300 text-center ${className}`}>
        <div className="inline-flex items-center justify-center gap-2">
          {showIcon && (
            <IconComponent className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
          )}
          <h2
            className={`text-[13px] font-bold uppercase tracking-[0.15em] text-stone-900 ${headingFontClass}`}
          >
            {title}
          </h2>
        </div>
        <div
          className="mx-auto mt-1 h-[2px] w-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  }

  if (templateId === 'creative') {
    return (
      <div className={`mb-3 flex items-center gap-2 ${className}`}>
        <div
          className="w-1.5 h-4.5 rounded-sm"
          style={{ backgroundColor: accentColor }}
        />
        {showIcon && (
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <IconComponent className="w-3 h-3 text-white" />
          </div>
        )}
        <h2
          className={`text-[13px] font-bold tracking-wide uppercase text-stone-900 ${headingFontClass}`}
        >
          {title}
        </h2>
        <div className="flex-1 h-[1px] bg-stone-200" />
      </div>
    );
  }

  if (templateId === 'compact') {
    return (
      <div
        className={`mb-2 pb-1 border-b flex items-center justify-between ${className}`}
        style={{ borderColor: hexToRgba(accentColor, 0.25) }}
      >
        <div className="flex items-center gap-1.5">
          {showIcon && (
            <IconComponent className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
          )}
          <h2
            className={`text-[11px] font-bold uppercase tracking-wider text-stone-900 ${headingFontClass}`}
          >
            {title}
          </h2>
        </div>
        <div
          className="h-[2px] w-5 rounded"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  }

  // Default & Modern Sidebar & Professional
  return (
    <div className={`mb-3 pb-1 border-b border-stone-200 ${className}`}>
      <div className="flex items-center gap-2">
        {showIcon && (
          <IconComponent className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
        )}
        <h2
          className={`text-[12.5px] font-bold uppercase tracking-wider text-stone-900 ${headingFontClass}`}
        >
          {title}
        </h2>
      </div>
      <div
        className="mt-1 h-[2px] w-7 rounded"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
};
