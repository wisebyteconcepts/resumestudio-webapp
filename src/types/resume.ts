export type TemplateId =
  | 'classic'
  | 'modern-sidebar'
  | 'minimal'
  | 'professional'
  | 'compact'
  | 'creative';

export type FontPair =
  | 'poppins-inter'
  | 'playfair-sourcesans'
  | 'merriweather-lato';

export type SectionKey =
  | 'objective'
  | 'skills'
  | 'experience'
  | 'education'
  | 'qualifications'
  | 'languages'
  | 'personal'
  | 'passport'
  | 'declaration';

export type DatePrecision = 'day' | 'month' | 'year';

export interface DateValue {
  precision: DatePrecision;
  year: number;
  month?: number; // 1-12
  day?: number;   // 1-31
}

export interface ExperienceItem {
  id: string;
  organisation: string;
  designation: string;
  from?: DateValue;
  to?: DateValue;
  // legacy backward-compatible fields
  fromMonth?: string;
  fromYear?: string;
  toMonth?: string;
  toYear?: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface EducationItem {
  id: string;
  courseName: string;
  institute: string;
  boardUniversity: string;
  from?: DateValue;
  to?: DateValue;
  // legacy backward-compatible fields
  fromYear?: string;
  toYear?: string;
  isCurrent: boolean;
  result: string;
}

export interface QualificationItem {
  id: string;
  name: string;
  institute: string;
  issuingAuthority: string;
  from?: DateValue;
  to?: DateValue;
  // legacy backward-compatible fields
  fromYear?: string;
  toYear?: string;
  isCurrent: boolean;
  result: string;
}

export interface CustomPersonalInfoField {
  id: string;
  label: string;
  value: string;
  isStandard?: boolean;
  standardKey?: string;
}

export interface PersonalInfo {
  fatherName?: string;
  motherName?: string;
  dob?: DateValue | string; // structured DateValue, supports legacy YYYY-MM-DD
  religion?: string;
  category?: string;
  maritalStatus?: string;
  country?: string;
  customFields?: CustomPersonalInfoField[];
  fieldOrder?: string[];
  hiddenStandardKeys?: string[];
}

export interface PassportDetails {
  enabled: boolean;
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue?: DateValue | string;
  expiryDate?: DateValue | string;
  issuingAuthority: string;
}

export interface DeclarationDetails {
  text: string;
  date?: DateValue | string;
  place: string;
  signatureUrl: string | null;
}

export interface BasicDetails {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  useWhatsApp: boolean;
  addressLines: string[];
  summary: string;
  photoUrl: string | null;
}

export interface ResumeData {
  basic: BasicDetails;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  qualifications: QualificationItem[];
  languages: string[];
  personal: PersonalInfo;
  passport: PassportDetails;
  declaration: DeclarationDetails;
}

export interface CustomisationSettings {
  templateId: TemplateId;
  accentColor: string;
  fontPair: FontPair;
  showHeadingIcons: boolean;
  sectionOrder: SectionKey[];
  hiddenSections: Record<SectionKey, boolean>;
  sectionIcons?: Record<SectionKey, string>; // Heroicon name (e.g. 'briefcase')
}

export interface ResumeStudioBackup {
  app: 'resume-studio';
  version: 2;
  exportedAt: string;
  settings: CustomisationSettings;
  data: ResumeData;
}
