import React from 'react';
import { TemplateId } from '../types/resume';

interface ThumbnailProps {
  templateId: TemplateId;
  accentColor?: string;
  className?: string;
}

export const TemplateThumbnail: React.FC<ThumbnailProps> = ({
  templateId,
  accentColor = '#8C3A27',
  className = 'w-full h-full',
}) => {
  switch (templateId) {
    case 'modern-sidebar':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Left Sidebar */}
          <rect width="70" height="297" fill="#F4EFEA" />
          <circle cx="35" cy="40" r="16" fill={accentColor} fillOpacity="0.25" stroke={accentColor} strokeWidth="1.5" />
          {/* Sidebar text lines */}
          <rect x="15" y="70" width="40" height="3" rx="1.5" fill="#1C1917" />
          <rect x="15" y="78" width="32" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="83" width="36" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="98" width="40" height="3" rx="1.5" fill="#1C1917" />
          <rect x="15" y="106" width="30" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="111" width="35" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="126" width="40" height="3" rx="1.5" fill="#1C1917" />
          <rect x="15" y="134" width="28" height="2" rx="1" fill="#78716C" />
          {/* Right Main Body */}
          <rect x="85" y="30" width="75" height="8" rx="2" fill="#1C1917" />
          <rect x="85" y="42" width="45" height="3" rx="1.5" fill={accentColor} />
          <line x1="85" y1="52" x2="195" y2="52" stroke="#E7E5E4" strokeWidth="1" />
          {/* Summary */}
          <rect x="85" y="60" width="110" height="2.5" rx="1" fill="#57534E" />
          <rect x="85" y="66" width="105" height="2.5" rx="1" fill="#78716C" />
          <rect x="85" y="72" width="80" height="2.5" rx="1" fill="#78716C" />
          {/* Experience Section */}
          <rect x="85" y="88" width="60" height="4" rx="1.5" fill="#1C1917" />
          <line x1="85" y1="95" x2="110" y2="95" stroke={accentColor} strokeWidth="1.5" />
          <rect x="85" y="102" width="70" height="3" rx="1" fill="#292524" />
          <rect x="85" y="108" width="40" height="2.5" rx="1" fill={accentColor} />
          <rect x="90" y="115" width="100" height="2" rx="1" fill="#78716C" />
          <rect x="90" y="120" width="95" height="2" rx="1" fill="#78716C" />
          {/* Experience 2 */}
          <rect x="85" y="132" width="65" height="3" rx="1" fill="#292524" />
          <rect x="85" y="138" width="45" height="2.5" rx="1" fill={accentColor} />
          <rect x="90" y="145" width="95" height="2" rx="1" fill="#78716C" />
          {/* Education */}
          <rect x="85" y="162" width="50" height="4" rx="1.5" fill="#1C1917" />
          <line x1="85" y1="169" x2="105" y2="169" stroke={accentColor} strokeWidth="1.5" />
          <rect x="85" y="176" width="80" height="3" rx="1" fill="#292524" />
          <rect x="85" y="182" width="55" height="2.5" rx="1" fill="#78716C" />
        </svg>
      );

    case 'classic':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Centered photo */}
          <circle cx="105" cy="35" r="14" fill="#E7E5E4" stroke={accentColor} strokeWidth="1.5" />
          {/* Centered Name */}
          <rect x="65" y="55" width="80" height="7" rx="2" fill="#1C1917" />
          <rect x="80" y="66" width="50" height="3" rx="1" fill={accentColor} />
          <rect x="55" y="73" width="100" height="2" rx="1" fill="#78716C" />
          <line x1="25" y1="82" x2="185" y2="82" stroke="#D6D3D1" strokeWidth="1" />
          {/* Section 1 */}
          <rect x="85" y="92" width="40" height="3.5" rx="1" fill="#1C1917" />
          <rect x="95" y="98" width="20" height="1.5" fill={accentColor} />
          <rect x="25" y="106" width="160" height="2" rx="1" fill="#57534E" />
          <rect x="25" y="111" width="150" height="2" rx="1" fill="#78716C" />
          {/* Section 2 */}
          <rect x="80" y="124" width="50" height="3.5" rx="1" fill="#1C1917" />
          <rect x="95" y="130" width="20" height="1.5" fill={accentColor} />
          <rect x="25" y="138" width="60" height="3" rx="1" fill="#292524" />
          <rect x="25" y="144" width="40" height="2" rx="1" fill={accentColor} />
          <rect x="30" y="150" width="150" height="2" rx="1" fill="#78716C" />
          <rect x="30" y="155" width="140" height="2" rx="1" fill="#78716C" />
          {/* Section 3 */}
          <rect x="82" y="172" width="46" height="3.5" rx="1" fill="#1C1917" />
          <rect x="95" y="178" width="20" height="1.5" fill={accentColor} />
          <rect x="25" y="186" width="70" height="3" rx="1" fill="#292524" />
          <rect x="25" y="192" width="45" height="2" rx="1" fill="#78716C" />
        </svg>
      );

    case 'minimal':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Header left */}
          <rect x="25" y="30" width="85" height="8" rx="1" fill="#0C0A09" />
          <rect x="25" y="42" width="50" height="2.5" rx="1" fill="#78716C" />
          <rect x="25" y="48" width="70" height="2" rx="1" fill="#A8A29E" />
          {/* Small circle photo right */}
          <circle cx="175" cy="40" r="14" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1" />
          <line x1="25" y1="60" x2="185" y2="60" stroke="#E7E5E4" strokeWidth="0.8" />
          {/* Clean small caps headings */}
          <rect x="25" y="72" width="45" height="2.5" rx="1" fill="#1C1917" />
          <line x1="25" y1="78" x2="185" y2="78" stroke="#E7E5E4" strokeWidth="0.6" />
          <rect x="25" y="86" width="160" height="2" rx="1" fill="#57534E" />
          <rect x="25" y="91" width="155" height="2" rx="1" fill="#78716C" />
          {/* Experience */}
          <rect x="25" y="108" width="55" height="2.5" rx="1" fill="#1C1917" />
          <line x1="25" y1="114" x2="185" y2="114" stroke="#E7E5E4" strokeWidth="0.6" />
          <rect x="25" y="122" width="60" height="3" rx="1" fill="#292524" />
          <rect x="25" y="127" width="40" height="2" rx="1" fill="#78716C" />
          <rect x="30" y="133" width="150" height="2" rx="1" fill="#78716C" />
          <rect x="30" y="138" width="130" height="2" rx="1" fill="#78716C" />
          {/* Education */}
          <rect x="25" y="156" width="45" height="2.5" rx="1" fill="#1C1917" />
          <line x1="25" y1="162" x2="185" y2="162" stroke="#E7E5E4" strokeWidth="0.6" />
          <rect x="25" y="170" width="70" height="3" rx="1" fill="#292524" />
          <rect x="25" y="175" width="50" height="2" rx="1" fill="#78716C" />
        </svg>
      );

    case 'professional':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Header Banner */}
          <rect width="210" height="65" fill={accentColor} />
          <rect x="25" y="20" width="80" height="8" rx="2" fill="#FFFFFF" />
          <rect x="25" y="32" width="50" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" />
          <rect x="25" y="40" width="70" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.7" />
          <circle cx="175" cy="32" r="16" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Two-column body */}
          {/* Left col 60% */}
          <rect x="20" y="80" width="50" height="4" rx="1" fill="#1C1917" />
          <line x1="20" y1="87" x2="45" y2="87" stroke={accentColor} strokeWidth="1.5" />
          <rect x="20" y="95" width="60" height="3" rx="1" fill="#292524" />
          <rect x="20" y="101" width="40" height="2.5" rx="1" fill={accentColor} />
          <rect x="25" y="108" width="85" height="2" rx="1" fill="#78716C" />
          <rect x="25" y="113" width="80" height="2" rx="1" fill="#78716C" />
          {/* Right col 40% */}
          <line x1="125" y1="75" x2="125" y2="280" stroke="#E7E5E4" strokeWidth="0.8" />
          <rect x="135" y="80" width="40" height="4" rx="1" fill="#1C1917" />
          <line x1="135" y1="87" x2="155" y2="87" stroke={accentColor} strokeWidth="1.5" />
          <rect x="135" y="95" width="55" height="5" rx="2" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="0.5" />
          <rect x="135" y="104" width="50" height="5" rx="2" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="0.5" />
        </svg>
      );

    case 'compact':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Top header thin bar */}
          <rect x="15" y="15" width="14" height="14" rx="2" fill="#F5F5F4" stroke={accentColor} strokeWidth="1" />
          <rect x="35" y="17" width="65" height="6" rx="1" fill="#1C1917" />
          <rect x="35" y="25" width="40" height="2.5" rx="1" fill={accentColor} />
          <rect x="130" y="17" width="65" height="2" rx="1" fill="#78716C" />
          <rect x="140" y="22" width="55" height="2" rx="1" fill="#78716C" />
          <line x1="15" y1="34" x2="195" y2="34" stroke={accentColor} strokeWidth="1.5" />
          {/* Dense lines */}
          <rect x="15" y="42" width="35" height="3" rx="1" fill="#1C1917" />
          <rect x="15" y="49" width="180" height="2" rx="1" fill="#57534E" />
          <rect x="15" y="54" width="175" height="2" rx="1" fill="#78716C" />
          {/* Roles */}
          <rect x="15" y="65" width="40" height="3" rx="1" fill="#1C1917" />
          <rect x="15" y="72" width="60" height="2.5" rx="1" fill="#292524" />
          <rect x="15" y="77" width="175" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="82" width="170" height="2" rx="1" fill="#78716C" />
          <rect x="15" y="90" width="60" height="2.5" rx="1" fill="#292524" />
          <rect x="15" y="95" width="175" height="2" rx="1" fill="#78716C" />
          {/* Skills chips */}
          <rect x="15" y="108" width="30" height="3" rx="1" fill="#1C1917" />
          <rect x="15" y="115" width="25" height="4" rx="1" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="0.5" />
          <rect x="44" y="115" width="28" height="4" rx="1" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="0.5" />
          <rect x="76" y="115" width="32" height="4" rx="1" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="0.5" />
        </svg>
      );

    case 'creative':
      return (
        <svg
          viewBox="0 0 210 297"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect width="210" height="297" fill="#FFFFFF" />
          {/* Accent geometry top right */}
          <path d="M120 0 L210 0 L210 25 L140 25 Z" fill={accentColor} />
          {/* Bold name */}
          <rect x="25" y="25" width="85" height="9" rx="2" fill="#0C0A09" />
          <rect x="25" y="38" width="55" height="3.5" rx="1.5" fill={accentColor} />
          <rect x="25" y="47" width="80" height="2.5" rx="1" fill="#78716C" />
          {/* Rounded square photo */}
          <rect x="155" y="25" width="30" height="30" rx="8" fill="#F5F5F4" stroke={accentColor} strokeWidth="2" />
          <line x1="25" y1="62" x2="185" y2="62" stroke="#E7E5E4" strokeWidth="1" />
          {/* Section with vertical accent bar */}
          <rect x="25" y="74" width="3" height="10" rx="1" fill={accentColor} />
          <rect x="33" y="77" width="50" height="4" rx="1" fill="#1C1917" />
          <rect x="25" y="90" width="160" height="2" rx="1" fill="#57534E" />
          <rect x="25" y="95" width="150" height="2" rx="1" fill="#78716C" />
          {/* Section 2 */}
          <rect x="25" y="112" width="3" height="10" rx="1" fill={accentColor} />
          <rect x="33" y="115" width="60" height="4" rx="1" fill="#1C1917" />
          <rect x="25" y="128" width="70" height="3" rx="1" fill="#292524" />
          <rect x="25" y="134" width="45" height="2.5" rx="1" fill={accentColor} />
          <rect x="30" y="141" width="155" height="2" rx="1" fill="#78716C" />
        </svg>
      );
  }
};
