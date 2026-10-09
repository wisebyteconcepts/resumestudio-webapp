import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserIcon } from '@heroicons/react/24/outline';
import {
  CustomisationSettings,
  ResumeData,
  SectionKey,
} from '../types/resume';
import { CustomisationCard } from './CustomisationCard';
import { FormSection } from './FormSection';
import { BasicDetailsForm } from './form/BasicDetailsForm';
import { EducationForm } from './form/EducationForm';
import { ExperienceForm } from './form/ExperienceForm';
import { LanguagesForm } from './form/LanguagesForm';
import { PassportForm } from './form/PassportForm';
import { PersonalInfoForm } from './form/PersonalInfoForm';
import { QualificationsForm } from './form/QualificationsForm';
import { SkillsForm } from './form/SkillsForm';
import { DeclarationForm } from './form/DeclarationForm';
import { A4ResumePreview } from './preview/A4ResumePreview';
import {
  DEFAULT_SECTION_ICONS,
  getHeroIconComponent,
} from './common/HeroIcon';
import { SectionIconPickerModal } from './common/SectionIconPickerModal';

interface ResumeEditorProps {
  data: ResumeData;
  settings: CustomisationSettings;
  onUpdateData: (updater: (prev: ResumeData) => ResumeData) => void;
  onUpdateSettings: (updater: (prev: CustomisationSettings) => CustomisationSettings) => void;
  onToast?: (message: string, undoAction?: () => void) => void;
}

// Wrapper for Draggable Section Card
const SortableSectionCardWrapper: React.FC<{
  sectionKey: SectionKey;
  index: number;
  total: number;
  settings: CustomisationSettings;
  isOpen: boolean;
  onToggleOpen: () => void;
  isHidden: boolean;
  onToggleHide: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenIconPicker: () => void;
  isAnyDragging: boolean;
  children: React.ReactNode;
  itemCount?: number;
}> = ({
  sectionKey,
  index,
  total,
  settings,
  isOpen,
  onToggleOpen,
  isHidden,
  onToggleHide,
  onMoveUp,
  onMoveDown,
  onOpenIconPicker,
  isAnyDragging,
  children,
  itemCount,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const titles: Record<SectionKey, string> = {
    objective: 'Profile Summary',
    skills: 'Key Skills',
    experience: 'Work Experience',
    education: 'Education',
    qualifications: 'Professional Qualifications',
    languages: 'Languages',
    personal: 'Personal Information',
    passport: 'Passport Details',
    declaration: 'Declaration',
  };

  const iconName =
    settings.sectionIcons?.[sectionKey] ||
    DEFAULT_SECTION_ICONS[sectionKey] ||
    'DocumentTextIcon';
  const IconComponent = getHeroIconComponent(iconName);

  return (
    <div ref={setNodeRef} style={style}>
      <FormSection
        id={sectionKey}
        title={titles[sectionKey]}
        icon={<IconComponent className="w-4 h-4 text-white" />}
        iconBgColor={settings.accentColor}
        itemCount={itemCount}
        // Auto-collapse while any section is dragging for clean reordering
        isOpen={isAnyDragging ? false : isOpen}
        onToggleOpen={onToggleOpen}
        isHidden={isHidden}
        onToggleHide={onToggleHide}
        canMoveUp={index > 0}
        canMoveDown={index < total - 1}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onOpenIconPicker={onOpenIconPicker}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      >
        {children}
      </FormSection>
    </div>
  );
};

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  data,
  settings,
  onUpdateData,
  onUpdateSettings,
  onToast,
}) => {
  // Mobile tab toggle between 'form' and 'preview'
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Open/collapsed states of section cards (UI state only)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customisation: false, // Collapsible design panel, starts collapsed
    basic: true,
    objective: false,
    skills: true,
    experience: true,
    education: true,
    qualifications: false,
    languages: false,
    personal: false,
    passport: false,
    declaration: false,
  });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Icon picker modal state
  const [iconPickerSection, setIconPickerSection] = useState<SectionKey | null>(null);

  const toggleOpen = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Section reordering handlers
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...settings.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;

    const temp = order[index];
    order[index] = order[targetIdx];
    order[targetIdx] = temp;

    onUpdateSettings((prev) => ({ ...prev, sectionOrder: order }));
  };

  const handleToggleHideSection = (key: SectionKey) => {
    onUpdateSettings((prev) => ({
      ...prev,
      hiddenSections: {
        ...prev.hiddenSections,
        [key]: !prev.hiddenSections[key],
      },
    }));
  };

  // Icon change handler
  const handleSelectSectionIcon = (newIconName: string) => {
    if (!iconPickerSection) return;
    onUpdateSettings((prev) => ({
      ...prev,
      sectionIcons: {
        ...(prev.sectionIcons || DEFAULT_SECTION_ICONS),
        [iconPickerSection]: newIconName,
      },
    }));
  };

  // Dnd-kit sensors with pointer threshold to avoid accidental drags on mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (over && active.id !== over.id) {
      const oldIndex = settings.sectionOrder.indexOf(active.id as SectionKey);
      const newIndex = settings.sectionOrder.indexOf(over.id as SectionKey);
      if (oldIndex !== -1 && newIndex !== -1) {
        const nextOrder = arrayMove(settings.sectionOrder, oldIndex, newIndex);
        onUpdateSettings((prev) => ({ ...prev, sectionOrder: nextOrder }));
      }
    }
  };

  // Renders specific form body for a section
  const renderSectionBody = (key: SectionKey) => {
    switch (key) {
      case 'objective':
        return (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-stone-700">
              Profile Summary / Career Objective
            </label>
            <textarea
              rows={4}
              value={data.basic.summary}
              onChange={(e) =>
                onUpdateData((prev) => ({
                  ...prev,
                  basic: { ...prev.basic, summary: e.target.value },
                }))
              }
              placeholder="Provide a compelling overview of your expertise, career accomplishments, and value proposition..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
            />
          </div>
        );

      case 'skills':
        return (
          <SkillsForm
            skills={data.skills}
            onChange={(newSkills) =>
              onUpdateData((prev) => ({ ...prev, skills: newSkills }))
            }
          />
        );

      case 'experience':
        return (
          <ExperienceForm
            experience={data.experience}
            onChange={(newExp) =>
              onUpdateData((prev) => ({ ...prev, experience: newExp }))
            }
            onToast={onToast}
          />
        );

      case 'education':
        return (
          <EducationForm
            education={data.education}
            onChange={(newEdu) =>
              onUpdateData((prev) => ({ ...prev, education: newEdu }))
            }
            onToast={onToast}
          />
        );

      case 'qualifications':
        return (
          <QualificationsForm
            qualifications={data.qualifications}
            onChange={(newQual) =>
              onUpdateData((prev) => ({ ...prev, qualifications: newQual }))
            }
            onToast={onToast}
          />
        );

      case 'languages':
        return (
          <LanguagesForm
            languages={data.languages}
            onChange={(newLangs) =>
              onUpdateData((prev) => ({ ...prev, languages: newLangs }))
            }
          />
        );

      case 'personal':
        return (
          <PersonalInfoForm
            personal={data.personal}
            onChange={(updated) =>
              onUpdateData((prev) => ({
                ...prev,
                personal: { ...prev.personal, ...updated },
              }))
            }
          />
        );

      case 'passport':
        return (
          <PassportForm
            passport={data.passport}
            onChange={(updated) =>
              onUpdateData((prev) => ({
                ...prev,
                passport: { ...prev.passport, ...updated },
              }))
            }
          />
        );

      case 'declaration':
        return (
          <DeclarationForm
            declaration={data.declaration}
            onChange={(updated) =>
              onUpdateData((prev) => ({
                ...prev,
                declaration: { ...prev.declaration, ...updated },
              }))
            }
          />
        );

      default:
        return null;
    }
  };

  const getItemCount = (key: SectionKey): number | undefined => {
    switch (key) {
      case 'skills':
        return data.skills.length;
      case 'experience':
        return data.experience.length;
      case 'education':
        return data.education.length;
      case 'qualifications':
        return data.qualifications.length;
      case 'languages':
        return data.languages.length;
      case 'passport':
        return data.passport.enabled ? 1 : 0;
      default:
        return undefined;
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden mb-6 flex p-1 bg-stone-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mobileTab === 'form'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Resume Details & Settings
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Live A4 Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Cards */}
        <div
          className={`lg:col-span-6 xl:col-span-6 space-y-4 p-1 sm:p-1.5 ${
            mobileTab === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Customisation Card */}
          <CustomisationCard
            settings={settings}
            isOpen={openSections.customisation}
            onToggleOpen={() => toggleOpen('customisation')}
            onChange={(updated) =>
              onUpdateSettings((prev) => ({ ...prev, ...updated }))
            }
          />

          {/* Section 1: Basic Details (Always pinned at top of form, not draggable, no hide toggle) */}
          <FormSection
            id="basic"
            title="Basic Details & Contact"
            icon={<UserIcon className="w-4 h-4 text-white" />}
            iconBgColor={settings.accentColor}
            isOpen={openSections.basic}
            onToggleOpen={() => toggleOpen('basic')}
          >
            <BasicDetailsForm
              data={data.basic}
              onChange={(updated) =>
                onUpdateData((prev) => ({
                  ...prev,
                  basic: { ...prev.basic, ...updated },
                }))
              }
            />
          </FormSection>

          {/* Reorderable Section Cards via Dnd-kit */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={settings.sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {settings.sectionOrder.map((sectionKey, index) => {
                  const isOpen = !!openSections[sectionKey];
                  const isHidden = !!settings.hiddenSections[sectionKey];

                  return (
                    <SortableSectionCardWrapper
                      key={sectionKey}
                      sectionKey={sectionKey}
                      index={index}
                      total={settings.sectionOrder.length}
                      settings={settings}
                      isOpen={isOpen}
                      onToggleOpen={() => toggleOpen(sectionKey)}
                      isHidden={isHidden}
                      onToggleHide={() => handleToggleHideSection(sectionKey)}
                      onMoveUp={() => handleMoveSection(index, 'up')}
                      onMoveDown={() => handleMoveSection(index, 'down')}
                      onOpenIconPicker={() => setIconPickerSection(sectionKey)}
                      isAnyDragging={!!activeDragId}
                      itemCount={getItemCount(sectionKey)}
                    >
                      {renderSectionBody(sectionKey)}
                    </SortableSectionCardWrapper>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Column: Sticky Live A4 Preview Pane fitting within viewport */}
        <div
          className={`lg:col-span-6 xl:col-span-6 lg:sticky lg:top-[68px] lg:h-[calc(100vh-84px)] ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="rounded-2xl border border-stone-200/90 shadow-md bg-white overflow-hidden h-full flex flex-col">
            <A4ResumePreview
              data={data}
              settings={settings}
              className="h-full w-full flex-1"
            />
          </div>
        </div>
      </div>

      {/* Heroicons Searchable Popover Modal */}
      {iconPickerSection && (
        <SectionIconPickerModal
          sectionKey={iconPickerSection}
          currentIconName={
            settings.sectionIcons?.[iconPickerSection] ||
            DEFAULT_SECTION_ICONS[iconPickerSection] ||
            'DocumentTextIcon'
          }
          isOpen={!!iconPickerSection}
          onClose={() => setIconPickerSection(null)}
          onSelectIcon={handleSelectSectionIcon}
          accentColor={settings.accentColor}
        />
      )}
    </div>
  );
};
