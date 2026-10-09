import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import { SectionKey } from '../../types/resume';

// Curated default icon mapping per section
export const DEFAULT_SECTION_ICONS: Record<SectionKey, string> = {
  objective: 'FlagIcon',
  skills: 'WrenchIcon',
  experience: 'BriefcaseIcon',
  education: 'AcademicCapIcon',
  qualifications: 'IdentificationIcon',
  languages: 'LanguageIcon',
  personal: 'UserCircleIcon',
  passport: 'GlobeAltIcon',
  declaration: 'PencilSquareIcon',
};

// Friendly curated list for fast search and display in picker
export interface IconMeta {
  id: string; // Component export name, e.g. 'BriefcaseIcon'
  name: string; // Friendly name, e.g. 'Briefcase'
  keywords: string[];
}

export const CURATED_ICONS: IconMeta[] = [
  { id: 'UserIcon', name: 'User', keywords: ['profile', 'person', 'account', 'basic', 'human'] },
  { id: 'UserCircleIcon', name: 'User Circle', keywords: ['personal', 'profile', 'avatar', 'details'] },
  { id: 'FlagIcon', name: 'Flag', keywords: ['objective', 'goal', 'target', 'milestone', 'summary'] },
  { id: 'BriefcaseIcon', name: 'Briefcase', keywords: ['work', 'experience', 'job', 'career', 'business', 'office'] },
  { id: 'AcademicCapIcon', name: 'Academic Cap', keywords: ['education', 'degree', 'college', 'school', 'university'] },
  { id: 'IdentificationIcon', name: 'Identification Card', keywords: ['id', 'license', 'badge', 'qualification', 'credentials'] },
  { id: 'CheckBadgeIcon', name: 'Check Badge', keywords: ['certified', 'verified', 'award', 'qualification'] },
  { id: 'WrenchIcon', name: 'Wrench', keywords: ['skills', 'tools', 'technical', 'development'] },
  { id: 'WrenchScrewdriverIcon', name: 'Wrench & Screwdriver', keywords: ['tools', 'engineering', 'skills'] },
  { id: 'BoltIcon', name: 'Bolt', keywords: ['skills', 'lightning', 'fast', 'energy', 'power'] },
  { id: 'LanguageIcon', name: 'Language', keywords: ['speech', 'languages', 'translate', 'words'] },
  { id: 'GlobeAltIcon', name: 'Globe Alt', keywords: ['passport', 'international', 'world', 'travel', 'global'] },
  { id: 'GlobeAmericasIcon', name: 'Globe Americas', keywords: ['world', 'international', 'passport'] },
  { id: 'PencilSquareIcon', name: 'Pencil Square', keywords: ['declaration', 'sign', 'signature', 'write', 'edit'] },
  { id: 'DocumentTextIcon', name: 'Document Text', keywords: ['resume', 'doc', 'paper', 'text', 'bio'] },
  { id: 'DocumentCheckIcon', name: 'Document Check', keywords: ['verified', 'cert', 'qualification', 'tested'] },
  { id: 'TrophyIcon', name: 'Trophy', keywords: ['award', 'achievement', 'winner', 'honour'] },
  { id: 'StarIcon', name: 'Star', keywords: ['skills', 'rating', 'feature', 'top'] },
  { id: 'SparklesIcon', name: 'Sparkles', keywords: ['creative', 'magic', 'ai', 'clean', 'fresh'] },
  { id: 'BuildingOffice2Icon', name: 'Building Office', keywords: ['company', 'organisation', 'corporate', 'work'] },
  { id: 'BookOpenIcon', name: 'Book Open', keywords: ['education', 'reading', 'learning', 'knowledge'] },
  { id: 'CodeBracketIcon', name: 'Code Bracket', keywords: ['developer', 'coding', 'programming', 'software'] },
  { id: 'ComputerDesktopIcon', name: 'Computer Desktop', keywords: ['tech', 'pc', 'hardware', 'frontend'] },
  { id: 'CpuChipIcon', name: 'CPU Chip', keywords: ['hardware', 'tech', 'system', 'architecture'] },
  { id: 'ChartBarIcon', name: 'Chart Bar', keywords: ['analytics', 'metrics', 'growth', 'data'] },
  { id: 'FolderIcon', name: 'Folder', keywords: ['projects', 'portfolio', 'files'] },
  { id: 'HeartIcon', name: 'Heart', keywords: ['volunteer', 'passion', 'interests'] },
  { id: 'PhoneIcon', name: 'Phone', keywords: ['call', 'contact', 'telephone'] },
  { id: 'EnvelopeIcon', name: 'Envelope', keywords: ['email', 'mail', 'message', 'contact'] },
  { id: 'MapPinIcon', name: 'Map Pin', keywords: ['address', 'location', 'city', 'place'] },
  { id: 'ShieldCheckIcon', name: 'Shield Check', keywords: ['security', 'passport', 'verification', 'safe'] },
  { id: 'ClockIcon', name: 'Clock', keywords: ['experience', 'time', 'years', 'history'] },
];

/**
 * Resolves an icon name to a Heroicon React component.
 * Fallbacks safely to UserIcon or DocumentTextIcon.
 */
export function getHeroIconComponent(
  iconName?: string
): React.ComponentType<{ className?: string; style?: React.CSSProperties }> {
  if (iconName && iconName in OutlineIcons) {
    return (OutlineIcons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
  }
  // Try matching stripped names e.g. 'briefcase' -> 'BriefcaseIcon'
  if (iconName) {
    const pascal = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const withIcon = pascal.endsWith('Icon') ? pascal : `${pascal}Icon`;
    if (withIcon in OutlineIcons) {
      return (OutlineIcons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[withIcon];
    }
  }
  return OutlineIcons.DocumentTextIcon;
}

interface HeroIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const HeroIcon: React.FC<HeroIconProps> = ({ name, className = 'w-4 h-4', style }) => {
  const IconComp = getHeroIconComponent(name);
  return <IconComp className={className} style={style} />;
};
