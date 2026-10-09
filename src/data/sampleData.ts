import { CustomisationSettings, ResumeData, SectionKey } from '../types/resume';

export const SECTION_METADATA: Record<
  SectionKey,
  { label: string; description: string; iconName: string }
> = {
  objective: {
    label: 'Profile Summary',
    description: 'Executive bio or career objective',
    iconName: 'FlagIcon',
  },
  skills: {
    label: 'Key Skills',
    description: 'Core competencies & technologies',
    iconName: 'WrenchIcon',
  },
  experience: {
    label: 'Work Experience',
    description: 'Professional roles & accomplishments',
    iconName: 'BriefcaseIcon',
  },
  education: {
    label: 'Education',
    description: 'Degrees, colleges & universities',
    iconName: 'AcademicCapIcon',
  },
  qualifications: {
    label: 'Professional Qualifications',
    description: 'Certifications & licenses',
    iconName: 'IdentificationIcon',
  },
  languages: {
    label: 'Languages',
    description: 'Language proficiencies',
    iconName: 'LanguageIcon',
  },
  personal: {
    label: 'Personal Information',
    description: 'DOB, marital status, parents',
    iconName: 'UserCircleIcon',
  },
  passport: {
    label: 'Passport Details',
    description: 'Passport number, issue & expiry',
    iconName: 'GlobeAltIcon',
  },
  declaration: {
    label: 'Declaration',
    description: 'Statement of truth & signature',
    iconName: 'PencilSquareIcon',
  },
};

export const TEMPLATE_INFO = [
  {
    id: 'classic' as const,
    name: 'Classic',
    desc: 'Centred serif header, balanced rules, traditional elegance.',
    badge: 'Traditional',
    tag: 'Single-column · Centered',
  },
  {
    id: 'modern-sidebar' as const,
    name: 'Modern Sidebar',
    desc: 'Tinted left sidebar with contact & skills; spacious right body.',
    badge: 'Popular',
    tag: 'Left sidebar · High impact',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    desc: 'Whitespace-led, small-caps headers, pure editorial typography.',
    badge: 'Clean',
    tag: 'Typography-focused · Clean',
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    desc: 'Accent colour top banner with structured two-column layout.',
    badge: 'Corporate',
    tag: 'Banner header · Executive',
  },
  {
    id: 'compact' as const,
    name: 'Compact',
    desc: 'High-density grid designed to fit dense experience onto 1 page.',
    badge: 'Dense',
    tag: 'Dense layout · 2-page fit',
  },
  {
    id: 'creative' as const,
    name: 'Creative',
    desc: 'Bold display typography, geometric accents & modern flair.',
    badge: 'Modern',
    tag: 'Playful accent · Design/Tech',
  },
];

export const ACCENT_PRESETS = [
  { name: 'Terracotta', hex: '#8C3A27' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Purple', hex: '#6B21A8' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Teal', hex: '#0F766E' },
];

export const FONT_PAIRS = [
  {
    id: 'poppins-inter' as const,
    label: 'Poppins + Inter',
    headingFont: 'font-pair-poppins',
    bodyFont: 'font-pair-inter',
    description: 'Modern geometric sans with crisp body readability',
  },
  {
    id: 'playfair-sourcesans' as const,
    label: 'Playfair Display + Source Sans 3',
    headingFont: 'font-pair-playfair',
    bodyFont: 'font-pair-sourcesans',
    description: 'Warm literary editorial serif paired with humanist sans',
  },
  {
    id: 'merriweather-lato' as const,
    label: 'Merriweather + Lato',
    headingFont: 'font-pair-merriweather',
    bodyFont: 'font-pair-lato',
    description: 'Sturdy newspaper serif with balanced clean sans',
  },
];

export const DEFAULT_SETTINGS: CustomisationSettings = {
  templateId: 'modern-sidebar',
  accentColor: '#8C3A27',
  fontPair: 'poppins-inter',
  showHeadingIcons: true,
  sectionOrder: [
    'objective',
    'skills',
    'experience',
    'education',
    'qualifications',
    'languages',
    'personal',
    'passport',
    'declaration',
  ],
  hiddenSections: {
    objective: false,
    skills: false,
    experience: false,
    education: false,
    qualifications: false,
    languages: false,
    personal: false,
    passport: false,
    declaration: false,
  },
  sectionIcons: {
    objective: 'FlagIcon',
    skills: 'WrenchIcon',
    experience: 'BriefcaseIcon',
    education: 'AcademicCapIcon',
    qualifications: 'IdentificationIcon',
    languages: 'LanguageIcon',
    personal: 'UserCircleIcon',
    passport: 'GlobeAltIcon',
    declaration: 'PencilSquareIcon',
  },
};

export const DEFAULT_EMPTY_RESUME: ResumeData = {
  basic: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    useWhatsApp: false,
    addressLines: [''],
    summary: '',
    photoUrl: null,
  },
  skills: [],
  experience: [],
  education: [],
  qualifications: [],
  languages: [],
  personal: {
    fatherName: '',
    motherName: '',
    dob: '',
    religion: '',
    category: '',
    maritalStatus: '',
    country: '',
  },
  passport: {
    enabled: false,
    passportNumber: '',
    placeOfIssue: '',
    dateOfIssue: '',
    expiryDate: '',
    issuingAuthority: '',
  },
  declaration: {
    text: 'I hereby declare that all the information furnished above is true and correct to the best of my knowledge and belief.',
    date: new Date().toISOString().split('T')[0],
    place: '',
    signatureUrl: null,
  },
};

// High-fidelity portrait photo of Priya Sharma (rendered via clean SVG data URL for crisp rendering & zero network dependency)
const SAMPLE_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%238C3A27"/><stop offset="100%" stop-color="%235A2114"/></linearGradient><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23D49B74"/><stop offset="100%" stop-color="%23BF825B"/></linearGradient></defs><rect width="240" height="240" fill="%23EDE7DD"/><circle cx="120" cy="120" r="110" fill="url(%23bg)" opacity="0.12"/><path d="M50 230 C50 185 80 170 120 170 C160 170 190 185 190 230 Z" fill="%231E293B"/><path d="M102 170 L120 195 L138 170 Z" fill="%23FFFFFF"/><path d="M120 135 L120 172" stroke="%23A86E49" stroke-width="26" stroke-linecap="round"/><circle cx="120" cy="115" r="48" fill="url(%23skin)"/><path d="M72 108 C75 60 100 52 120 52 C148 52 168 62 168 108 C168 135 158 150 158 150 C158 150 152 92 144 88 C132 82 105 82 96 88 C88 92 82 150 82 150 C82 150 72 135 72 108 Z" fill="%2318181B"/><circle cx="104" cy="114" r="4" fill="%2318181B"/><circle cx="136" cy="114" r="4" fill="%2318181B"/><path d="M96 104 Q105 100 114 104" stroke="%2318181B" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M126 104 Q135 100 144 104" stroke="%2318181B" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M118 116 L120 125 L124 125" stroke="%23A86E49" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M108 134 Q120 143 132 134" stroke="%23A83232" stroke-width="2.8" fill="none" stroke-linecap="round"/></svg>`;

// Crisp elegant handwritten vector signature for Priya Sharma
const SAMPLE_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 90" width="320" height="90"><path d="M25 65 C32 40 45 15 50 12 C53 10 58 15 52 35 C48 48 38 72 35 78 C32 84 35 84 42 75 C52 64 68 45 80 44 C88 43 85 54 80 62 C76 68 85 64 94 56 C105 46 115 48 118 56 C120 62 125 58 135 50 C145 42 165 40 180 50 C195 60 215 48 230 46 C245 44 260 52 285 48 M40 50 L100 48 M160 52 Q210 38 275 42" fill="none" stroke="%231C1917" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const SAMPLE_PRIYA_SHARMA: ResumeData = {
  basic: {
    fullName: 'Priya Sharma',
    headline: 'Lead Frontend Architect',
    email: 'priya.sharma@atelier.dev',
    phone: '+91 98765 43210',
    useWhatsApp: true,
    addressLines: [
      'Indiranagar 100ft Road, Stage 1',
      'Bengaluru, Karnataka 560038',
    ],
    summary:
      'Frontend Architect with 9+ years of experience leading cross-functional teams in architecting high-performance web applications, design systems, and developer platforms. Passionate about web performance, accessibility, and modern component craftsmanship.',
    photoUrl: SAMPLE_AVATAR_SVG,
  },
  skills: [
    'React & Next.js',
    'TypeScript',
    'Design Systems',
    'Web Performance',
    'Tailwind CSS',
    'Architecture & RFCs',
    'GraphQL & REST',
    'A11y (WCAG AA)',
    'State Machines',
    'CI/CD & Monorepos',
  ],
  experience: [
    {
      id: 'exp-1',
      organisation: 'Razorpay Technologies',
      designation: 'Lead Frontend Architect',
      fromMonth: 'Jan',
      fromYear: '2022',
      toMonth: '',
      toYear: '',
      isCurrent: true,
      responsibilities: [
        'Spearheaded the complete redesign and migration of the core merchant checkout suite, reducing TTI by 42% across 12M daily sessions.',
        'Designed and governed the company-wide design token engine and headless UI primitives adopted by 45+ product teams.',
        'Mentored 14 senior engineers and established automated lighthouse performance budgets in GitHub CI pipelines.',
      ],
    },
    {
      id: 'exp-2',
      organisation: 'Flipkart Internet',
      designation: 'Senior Frontend Engineer',
      fromMonth: 'Jul',
      fromYear: '2018',
      toMonth: 'Dec',
      toYear: '2021',
      isCurrent: false,
      responsibilities: [
        'Engineered the next-generation category listing grid with virtualized scrolling, handling 50k+ skus at 60fps.',
        'Championed offline-first PWA caching strategies that lifted checkout conversion rates by 8.4% during flagship Big Billion Days.',
      ],
    },
    {
      id: 'exp-3',
      organisation: 'ThoughtWorks Technologies',
      designation: 'UI Consultant & Software Engineer',
      fromMonth: 'Aug',
      fromYear: '2015',
      toMonth: 'Jun',
      toYear: '2018',
      isCurrent: false,
      responsibilities: [
        'Delivered scalable frontends for Fortune 500 financial clients utilizing micro-frontends and domain-driven design principles.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      courseName: 'Master of Technology (Computer Science)',
      institute: 'IIIT Bangalore',
      boardUniversity: 'Autonomous University',
      fromYear: '2013',
      toYear: '2015',
      isCurrent: false,
      result: '9.4 CGPA (Gold Medalist)',
    },
    {
      id: 'edu-2',
      courseName: 'Bachelor of Engineering (Information Science)',
      institute: 'RV College of Engineering',
      boardUniversity: 'Visvesvaraya Technological University',
      fromYear: '2009',
      toYear: '2013',
      isCurrent: false,
      result: '8.9 CGPA (Distinction)',
    },
  ],
  qualifications: [
    {
      id: 'qual-1',
      name: 'AWS Certified Solutions Architect – Associate',
      institute: 'Amazon Web Services',
      issuingAuthority: 'AWS Global Certification',
      fromYear: '2023',
      toYear: '2026',
      isCurrent: true,
      result: 'Active Credential',
    },
    {
      id: 'qual-2',
      name: 'Certified Scrum Product Owner (CSPO)',
      institute: 'Scrum Alliance',
      issuingAuthority: 'Scrum Alliance Global',
      fromYear: '2021',
      toYear: '2023',
      isCurrent: false,
      result: 'Certified',
    },
  ],
  languages: [
    'English (Fluent)',
    'Hindi (Native)',
    'Kannada (Conversational)',
    'German (Elementary A2)',
  ],
  personal: {
    fatherName: 'R. K. Sharma',
    motherName: 'Sunita Sharma',
    dob: '1992-06-14',
    religion: 'Hindu',
    category: 'General',
    maritalStatus: 'Married',
    country: 'India',
  },
  passport: {
    enabled: true,
    passportNumber: 'Z4819203',
    placeOfIssue: 'RPO Bengaluru',
    dateOfIssue: '2018-04-12',
    expiryDate: '2028-04-11',
    issuingAuthority: 'Ministry of External Affairs, India',
  },
  declaration: {
    text: 'I hereby declare that all the information furnished above is true and correct to the best of my knowledge and belief.',
    date: new Date().toISOString().split('T')[0],
    place: 'Bengaluru',
    signatureUrl: SAMPLE_SIGNATURE_SVG,
  },
};
