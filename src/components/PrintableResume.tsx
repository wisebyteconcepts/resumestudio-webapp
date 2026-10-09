import React from 'react';
import { CustomisationSettings, ResumeData } from '../types/resume';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ModernSidebarTemplate } from './templates/ModernSidebarTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';

interface PrintableResumeProps {
  data: ResumeData;
  settings: CustomisationSettings;
}

export const PrintableResume: React.FC<PrintableResumeProps> = ({
  data,
  settings,
}) => {
  const headingFontClass =
    settings.fontPair === 'poppins-inter'
      ? 'font-pair-poppins'
      : settings.fontPair === 'playfair-sourcesans'
      ? 'font-pair-playfair'
      : 'font-pair-merriweather';

  const bodyFontClass =
    settings.fontPair === 'poppins-inter'
      ? 'font-pair-inter'
      : settings.fontPair === 'playfair-sourcesans'
      ? 'font-pair-sourcesans'
      : 'font-pair-lato';

  const renderTemplate = () => {
    const props = { data, settings, headingFontClass, bodyFontClass };
    switch (settings.templateId) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'modern-sidebar':
        return <ModernSidebarTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'professional':
        return <ProfessionalTemplate {...props} />;
      case 'compact':
        return <CompactTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      default:
        return <ModernSidebarTemplate {...props} />;
    }
  };

  return (
    <div
      id="printable-resume-container"
      className="print-only print-resume-page bg-white"
    >
      <div className="inner-page-wrapper">
        {renderTemplate()}
      </div>
    </div>
  );
};
