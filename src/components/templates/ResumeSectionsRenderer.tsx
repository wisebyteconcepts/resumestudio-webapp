import React from 'react';
import {
  CustomisationSettings,
  EducationItem,
  ExperienceItem,
  QualificationItem,
  ResumeData,
  SectionKey,
} from '../../types/resume';
import {
  formatDatePretty,
  formatDateValueRange,
  formatDOB,
  formatYearValueRange,
} from '../../utils/dateFormatter';
import { SectionHeading } from './SectionHeading';
import { hexToRgba } from '../../utils/colorUtils';

interface ResumeSectionsRendererProps {
  sectionKey: SectionKey;
  data: ResumeData;
  settings: CustomisationSettings;
  bodyFontClass: string;
  headingFontClass: string;
  isCompact?: boolean;
}

export const ResumeSectionItem: React.FC<ResumeSectionsRendererProps> = ({
  sectionKey,
  data,
  settings,
  bodyFontClass,
  headingFontClass,
  isCompact = false,
}) => {
  // If explicitly hidden by user, don't render
  if (settings.hiddenSections[sectionKey]) {
    return null;
  }

  const { accentColor, templateId, showHeadingIcons, sectionIcons } = settings;
  const customIconName = sectionIcons?.[sectionKey];

  switch (sectionKey) {
    case 'objective': {
      const summary = data.basic.summary?.trim();
      if (!summary) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="objective"
            title="Profile Summary"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <p
            className={`text-stone-700 leading-relaxed text-justify ${
              isCompact ? 'text-[9.5px]' : 'text-[10px]'
            } ${bodyFontClass}`}
          >
            {summary}
          </p>
        </section>
      );
    }

    case 'skills': {
      const skills = data.skills.filter(Boolean);
      if (skills.length === 0) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="skills"
            title="Key Skills"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded text-stone-800 border ${
                  isCompact ? 'text-[8.5px]' : 'text-[9px]'
                } ${bodyFontClass}`}
                style={{
                  backgroundColor: hexToRgba(accentColor, 0.06),
                  borderColor: hexToRgba(accentColor, 0.22),
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      );
    }

    case 'experience': {
      const validExperience = data.experience.filter(
        (exp) => exp.organisation?.trim() || exp.designation?.trim()
      );
      if (validExperience.length === 0) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="experience"
            title="Work Experience"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="space-y-3">
            {validExperience.map((exp: ExperienceItem) => {
              const dateRange = formatDateValueRange(
                exp.from,
                exp.to,
                exp.isCurrent,
                {
                  fromMonth: exp.fromMonth,
                  fromYear: exp.fromYear,
                  toMonth: exp.toMonth,
                  toYear: exp.toYear,
                }
              );
              return (
                <div key={exp.id} className="resume-section-item">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`font-semibold text-stone-900 ${
                        isCompact ? 'text-[10.5px]' : 'text-[11px]'
                      } ${headingFontClass}`}
                    >
                      {exp.designation || 'Designation'}
                    </h3>
                    {dateRange && (
                      <span
                        className={`text-stone-500 shrink-0 font-medium ${
                          isCompact ? 'text-[8.5px]' : 'text-[9px]'
                        } ${bodyFontClass}`}
                      >
                        {dateRange}
                      </span>
                    )}
                  </div>
                  {exp.organisation && (
                    <div
                      className={`font-medium ${
                        isCompact ? 'text-[9.5px]' : 'text-[10px]'
                      } ${bodyFontClass}`}
                      style={{ color: accentColor }}
                    >
                      {exp.organisation}
                    </div>
                  )}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul
                      className={`mt-1 space-y-0.5 list-disc list-outside pl-4 text-stone-700 ${
                        isCompact ? 'text-[9px]' : 'text-[9.5px]'
                      } ${bodyFontClass}`}
                    >
                      {exp.responsibilities
                        .filter((r) => r && r.trim())
                        .map((resp, rIdx) => (
                          <li key={rIdx} className="leading-snug">
                            {resp}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'education': {
      const validEducation = data.education.filter(
        (edu) => edu.courseName?.trim() || edu.institute?.trim()
      );
      if (validEducation.length === 0) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="education"
            title="Education"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="space-y-2.5">
            {validEducation.map((edu: EducationItem) => {
              const yearRange = formatYearValueRange(
                edu.from,
                edu.to,
                edu.isCurrent,
                {
                  fromYear: edu.fromYear,
                  toYear: edu.toYear,
                }
              );
              return (
                <div key={edu.id} className="resume-section-item">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`font-semibold text-stone-900 ${
                        isCompact ? 'text-[10px]' : 'text-[10.5px]'
                      } ${headingFontClass}`}
                    >
                      {edu.courseName}
                    </h3>
                    {yearRange && (
                      <span
                        className={`text-stone-500 shrink-0 font-medium ${
                          isCompact ? 'text-[8.5px]' : 'text-[9px]'
                        } ${bodyFontClass}`}
                      >
                        {yearRange}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-stone-600">
                    <span
                      className={`${
                        isCompact ? 'text-[9px]' : 'text-[9.5px]'
                      } ${bodyFontClass}`}
                    >
                      {[edu.institute, edu.boardUniversity]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    {edu.result && (
                      <span
                        className={`font-medium ${
                          isCompact ? 'text-[8.5px]' : 'text-[9px]'
                        } ${bodyFontClass}`}
                        style={{ color: accentColor }}
                      >
                        {edu.result}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'qualifications': {
      const validQual = data.qualifications.filter(
        (q) => q.name?.trim() || q.institute?.trim()
      );
      if (validQual.length === 0) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="qualifications"
            title="Professional Qualifications"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="space-y-2">
            {validQual.map((qual: QualificationItem) => {
              const yearRange = formatYearValueRange(
                qual.from,
                qual.to,
                qual.isCurrent,
                {
                  fromYear: qual.fromYear,
                  toYear: qual.toYear,
                }
              );
              return (
                <div key={qual.id} className="resume-section-item">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`font-semibold text-stone-900 ${
                        isCompact ? 'text-[10px]' : 'text-[10.5px]'
                      } ${headingFontClass}`}
                    >
                      {qual.name}
                    </h3>
                    {yearRange && (
                      <span
                        className={`text-stone-500 shrink-0 font-medium ${
                          isCompact ? 'text-[8.5px]' : 'text-[9px]'
                        } ${bodyFontClass}`}
                      >
                        {yearRange}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-stone-600">
                    <span
                      className={`${
                        isCompact ? 'text-[9px]' : 'text-[9.5px]'
                      } ${bodyFontClass}`}
                    >
                      {[qual.institute, qual.issuingAuthority]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    {qual.result && (
                      <span
                        className={`font-medium ${
                          isCompact ? 'text-[8.5px]' : 'text-[9px]'
                        } ${bodyFontClass}`}
                        style={{ color: accentColor }}
                      >
                        {qual.result}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'languages': {
      const langs = data.languages.filter(Boolean);
      if (langs.length === 0) return null;
      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="languages"
            title="Languages"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <p
            className={`text-stone-700 ${
              isCompact ? 'text-[9px]' : 'text-[9.5px]'
            } ${bodyFontClass}`}
          >
            {langs.join('  •  ')}
          </p>
        </section>
      );
    }

    case 'personal': {
      const { personal } = data;
      const dobFormatted = formatDOB(personal.dob);
      const hiddenKeys = personal.hiddenStandardKeys || [];
      const customFields = personal.customFields || [];

      // Map standard keys to resolved label & value
      const standardMap: Record<string, { label: string; val: string } | null> = {
        fatherName: personal.fatherName?.trim() ? { label: "Father's Name", val: personal.fatherName.trim() } : null,
        motherName: personal.motherName?.trim() ? { label: "Mother's Name", val: personal.motherName.trim() } : null,
        dob: dobFormatted ? { label: 'Date of Birth', val: dobFormatted } : null,
        maritalStatus: personal.maritalStatus?.trim() ? { label: 'Marital Status', val: personal.maritalStatus.trim() } : null,
        country: personal.country?.trim() ? { label: 'Nationality', val: personal.country.trim() } : null,
        religion: personal.religion?.trim() ? { label: 'Religion', val: personal.religion.trim() } : null,
        category: personal.category?.trim() ? { label: 'Category', val: personal.category.trim() } : null,
      };

      // Determine ordering
      const defaultStandardKeys = ['fatherName', 'motherName', 'dob', 'maritalStatus', 'country', 'religion', 'category'];
      const fieldOrder = personal.fieldOrder && personal.fieldOrder.length > 0
        ? personal.fieldOrder
        : [...defaultStandardKeys, ...customFields.map((cf) => cf.id)];

      const resolvedFields: Array<{ id: string; label: string; val: string }> = [];

      for (const id of fieldOrder) {
        if (hiddenKeys.includes(id)) continue;
        if (standardMap[id] !== undefined) {
          const std = standardMap[id];
          if (std && std.label && std.val) {
            resolvedFields.push({ id, label: std.label, val: std.val });
          }
        } else {
          const cf = customFields.find((c) => c.id === id);
          if (cf && cf.label?.trim() && cf.value?.trim()) {
            resolvedFields.push({ id: cf.id, label: cf.label.trim(), val: cf.value.trim() });
          }
        }
      }

      // Also pick up any custom fields not in fieldOrder
      for (const cf of customFields) {
        if (!fieldOrder.includes(cf.id) && cf.label?.trim() && cf.value?.trim()) {
          resolvedFields.push({ id: cf.id, label: cf.label.trim(), val: cf.value.trim() });
        }
      }

      if (resolvedFields.length === 0) return null;

      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="personal"
            title="Personal Information"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-700">
            {resolvedFields.map((f) => (
              <div
                key={f.id}
                className={`flex items-baseline gap-1.5 ${
                  isCompact ? 'text-[9px]' : 'text-[9.5px]'
                } ${bodyFontClass}`}
              >
                <span className="font-semibold text-stone-900 shrink-0">
                  {f.label}:
                </span>
                <span className="truncate">{f.val}</span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'passport': {
      const { passport } = data;
      if (!passport.enabled || !passport.passportNumber) return null;
      const issueFormatted = formatDatePretty(passport.dateOfIssue);
      const expiryFormatted = formatDatePretty(passport.expiryDate);

      return (
        <section className="resume-section-item mb-4">
          <SectionHeading
            sectionKey="passport"
            title="Passport Details"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-700">
            <div
              className={`flex items-baseline gap-1.5 ${
                isCompact ? 'text-[9px]' : 'text-[9.5px]'
              } ${bodyFontClass}`}
            >
              <span className="font-semibold text-stone-900">Passport No:</span>
              <span>{passport.passportNumber}</span>
            </div>
            {passport.placeOfIssue && (
              <div
                className={`flex items-baseline gap-1.5 ${
                  isCompact ? 'text-[9px]' : 'text-[9.5px]'
                } ${bodyFontClass}`}
              >
                <span className="font-semibold text-stone-900">Place of Issue:</span>
                <span>{passport.placeOfIssue}</span>
              </div>
            )}
            {issueFormatted && (
              <div
                className={`flex items-baseline gap-1.5 ${
                  isCompact ? 'text-[9px]' : 'text-[9.5px]'
                } ${bodyFontClass}`}
              >
                <span className="font-semibold text-stone-900">Date of Issue:</span>
                <span>{issueFormatted}</span>
              </div>
            )}
            {expiryFormatted && (
              <div
                className={`flex items-baseline gap-1.5 ${
                  isCompact ? 'text-[9px]' : 'text-[9.5px]'
                } ${bodyFontClass}`}
              >
                <span className="font-semibold text-stone-900">Valid Till:</span>
                <span>{expiryFormatted}</span>
              </div>
            )}
            {passport.issuingAuthority && (
              <div
                className={`col-span-2 flex items-baseline gap-1.5 ${
                  isCompact ? 'text-[9px]' : 'text-[9.5px]'
                } ${bodyFontClass}`}
              >
                <span className="font-semibold text-stone-900">Authority:</span>
                <span>{passport.issuingAuthority}</span>
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'declaration': {
      const { declaration, basic } = data;
      if (!declaration.text?.trim()) return null;
      const decDate = formatDatePretty(declaration.date);

      return (
        <section className="resume-section-item mb-4 pt-1">
          <SectionHeading
            sectionKey="declaration"
            title="Declaration"
            templateId={templateId}
            accentColor={accentColor}
            showIcon={showHeadingIcons}
            headingFontClass={headingFontClass}
            customIconName={customIconName}
          />
          <p
            className={`text-stone-700 leading-relaxed text-justify italic ${
              isCompact ? 'text-[9px]' : 'text-[9.5px]'
            } ${bodyFontClass}`}
          >
            "{declaration.text}"
          </p>

          <div className="mt-4 flex items-end justify-between">
            <div
              className={`space-y-0.5 text-stone-700 ${
                isCompact ? 'text-[9px]' : 'text-[9.5px]'
              } ${bodyFontClass}`}
            >
              {decDate && (
                <div>
                  <span className="font-semibold text-stone-900">Date:</span>{' '}
                  {decDate}
                </div>
              )}
              {declaration.place && (
                <div>
                  <span className="font-semibold text-stone-900">Place:</span>{' '}
                  {declaration.place}
                </div>
              )}
            </div>

            {/* Signature Block */}
            <div className="text-right flex flex-col items-end">
              {declaration.signatureUrl && (
                <div className="mb-1 flex justify-end">
                  <img
                    src={declaration.signatureUrl}
                    alt="Signature"
                    className="h-9 max-w-[130px] object-contain"
                  />
                </div>
              )}
              <div
                className={`font-bold text-stone-900 border-t border-stone-300 pt-1 min-w-[120px] text-center ${
                  isCompact ? 'text-[10px]' : 'text-[10.5px]'
                } ${headingFontClass}`}
              >
                {basic.fullName || 'Authorized Signature'}
              </div>
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
};
