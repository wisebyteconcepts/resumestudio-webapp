import {
  CustomisationSettings,
  ResumeData,
  ResumeStudioBackup,
} from '../types/resume';
import { DEFAULT_SETTINGS, SAMPLE_PRIYA_SHARMA } from '../data/sampleData';
import { parseToDateValue } from './dateFormatter';

const STORAGE_KEY_DATA = 'resume_studio_data_v2';
const STORAGE_KEY_SETTINGS = 'resume_studio_settings_v2';
const STORAGE_KEY_DATA_OLD = 'resume_studio_data_v1';
const STORAGE_KEY_SETTINGS_OLD = 'resume_studio_settings_v1';

export function loadSavedResume(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA) || localStorage.getItem(STORAGE_KEY_DATA_OLD);
    if (!raw) return SAMPLE_PRIYA_SHARMA;
    const parsed = JSON.parse(raw);
    return migrateResumeData(parsed);
  } catch (e) {
    console.warn('Failed to load resume from localStorage:', e);
    return SAMPLE_PRIYA_SHARMA;
  }
}

export function loadSavedSettings(): CustomisationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem(STORAGE_KEY_SETTINGS_OLD);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      hiddenSections: {
        ...DEFAULT_SETTINGS.hiddenSections,
        ...(parsed.hiddenSections || {}),
      },
      sectionOrder: parsed.sectionOrder || DEFAULT_SETTINGS.sectionOrder,
      sectionIcons: {
        ...(DEFAULT_SETTINGS.sectionIcons || {}),
        ...(parsed.sectionIcons || {}),
      },
    };
  } catch (e) {
    console.warn('Failed to load settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveResumeAndSettings(
  data: ResumeData,
  settings: CustomisationSettings
): { success: boolean; error?: string } {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    return { success: true };
  } catch (e: unknown) {
    console.error('Failed to save to localStorage:', e);
    const errorMsg = e instanceof Error ? e.message : 'Storage quota exceeded';
    return { success: false, error: errorMsg };
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_DATA_OLD);
    localStorage.removeItem(STORAGE_KEY_SETTINGS_OLD);
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
}

export function exportBackupJSON(
  data: ResumeData,
  settings: CustomisationSettings
): void {
  const backup: ResumeStudioBackup = {
    app: 'resume-studio',
    version: 2,
    exportedAt: new Date().toISOString(),
    settings,
    data,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanName = (data.basic.fullName || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = cleanName
    ? `${cleanName}_ResumeData.json`
    : 'resume-studio-backup.json';

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Migrates old schema v1 data:
 * - summary inside basic details maps to objective
 * - string dates migrate to structured DateValue
 */
export function migrateResumeData(raw: any): ResumeData {
  if (!raw || typeof raw !== 'object') return SAMPLE_PRIYA_SHARMA;

  const basic = { ...(raw.basic || {}) };
  // Ensure summary in basic is preserved (this is where Objective stores its text in the state)
  const summary = basic.summary || raw.objective || '';
  basic.summary = summary;

  // Experience dates migration
  const experience = (Array.isArray(raw.experience) ? raw.experience : []).map((exp: any) => ({
    ...exp,
    from: exp.from || (exp.fromYear ? parseToDateValue(`${exp.fromMonth || 'Jan'} ${exp.fromYear}`, 'month') : undefined),
    to: exp.to || (exp.toYear ? parseToDateValue(`${exp.toMonth || 'Jan'} ${exp.toYear}`, 'month') : undefined),
  }));

  // Education dates migration
  const education = (Array.isArray(raw.education) ? raw.education : []).map((edu: any) => ({
    ...edu,
    from: edu.from || (edu.fromYear ? parseToDateValue(String(edu.fromYear), 'year') : undefined),
    to: edu.to || (edu.toYear ? parseToDateValue(String(edu.toYear), 'year') : undefined),
  }));

  // Qualifications dates migration
  const qualifications = (Array.isArray(raw.qualifications) ? raw.qualifications : []).map((q: any) => ({
    ...q,
    from: q.from || (q.fromYear ? parseToDateValue(String(q.fromYear), 'year') : undefined),
    to: q.to || (q.toYear ? parseToDateValue(String(q.toYear), 'year') : undefined),
  }));

  // Personal DOB migration
  const personal = { ...(raw.personal || {}) };
  if (personal.dob && typeof personal.dob === 'string') {
    personal.dob = parseToDateValue(personal.dob, 'day') || personal.dob;
  }

  // Passport dates migration
  const passport = { ...(raw.passport || {}) };
  if (passport.dateOfIssue && typeof passport.dateOfIssue === 'string') {
    passport.dateOfIssue = parseToDateValue(passport.dateOfIssue, 'day') || passport.dateOfIssue;
  }
  if (passport.expiryDate && typeof passport.expiryDate === 'string') {
    passport.expiryDate = parseToDateValue(passport.expiryDate, 'day') || passport.expiryDate;
  }

  // Declaration date and visibility flags migration
  const declaration = { ...(raw.declaration || {}) };
  if (declaration.date && typeof declaration.date === 'string') {
    declaration.date = parseToDateValue(declaration.date, 'day') || declaration.date;
  }
  declaration.hideDate = typeof declaration.hideDate === 'boolean' ? declaration.hideDate : false;
  declaration.hidePlace = typeof declaration.hidePlace === 'boolean' ? declaration.hidePlace : false;
  declaration.hideSignature = typeof declaration.hideSignature === 'boolean' ? declaration.hideSignature : false;

  return {
    basic: {
      fullName: basic.fullName || '',
      headline: basic.headline || '',
      email: basic.email || '',
      phone: basic.phone || '',
      useWhatsApp: !!basic.useWhatsApp,
      addressLines: Array.isArray(basic.addressLines)
        ? basic.addressLines
        : [basic.addressLines || ''],
      summary: basic.summary || '',
      photoUrl: basic.photoUrl || null,
    },
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    experience,
    education,
    qualifications,
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    personal,
    passport,
    declaration,
  };
}

export function validateAndParseBackup(
  rawJson: string
): { success: boolean; data?: ResumeData; settings?: CustomisationSettings; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file format.' };
    }

    if (parsed.app !== 'resume-studio') {
      if (!parsed.data && !parsed.basic) {
        return {
          success: false,
          error: 'This file does not appear to be a Resume Studio backup.',
        };
      }
    }

    const rawData = parsed.data || parsed;
    const migratedData = migrateResumeData(rawData);

    const settings: CustomisationSettings = parsed.settings
      ? {
          ...DEFAULT_SETTINGS,
          ...parsed.settings,
          hiddenSections: {
            ...DEFAULT_SETTINGS.hiddenSections,
            ...(parsed.settings.hiddenSections || {}),
          },
          sectionIcons: {
            ...(DEFAULT_SETTINGS.sectionIcons || {}),
            ...(parsed.settings.sectionIcons || {}),
          },
        }
      : DEFAULT_SETTINGS;

    return {
      success: true,
      data: migratedData,
      settings,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Failed to read backup file. Please ensure it is valid JSON.',
    };
  }
}

/**
 * Resizes and downscales an uploaded image to prevent local storage quota exceeded.
 */
export async function downscaleImage(
  fileOrDataUrl: File | string,
  maxDimension = 360,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = (e) => reject(e);

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
