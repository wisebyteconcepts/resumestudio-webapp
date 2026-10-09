import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomPersonalInfoField, PersonalInfo } from '../../types/resume';
import { DatePicker } from '../common/DatePicker';
import { DragGripIcon } from '../FormSection';
import { formatDOB } from '../../utils/dateFormatter';

interface PersonalInfoFormProps {
  personal: PersonalInfo;
  onChange: (updated: Partial<PersonalInfo>) => void;
  accentColor?: string;
}

// Definition of the standard fields
export interface StandardFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'date' | 'select';
  options?: string[];
}

export const STANDARD_FIELDS_DEF: StandardFieldDef[] = [
  { key: 'fatherName', label: "Father's Name", placeholder: 'e.g. R. K. Sharma', type: 'text' },
  { key: 'motherName', label: "Mother's Name", placeholder: 'e.g. Sunita Sharma', type: 'text' },
  { key: 'dob', label: 'Date of Birth', placeholder: 'e.g. 12 March 1998', type: 'date' },
  { key: 'religion', label: 'Religion', placeholder: 'e.g. Hindu / Christian / Other', type: 'text' },
  { key: 'category', label: 'Category', placeholder: 'e.g. General / OBC / SC / ST', type: 'text' },
  {
    key: 'maritalStatus',
    label: 'Marital Status',
    type: 'select',
    options: ['Single', 'Married', 'Unmarried', 'Other'],
  },
  { key: 'country', label: 'Country / Nationality', placeholder: 'e.g. India', type: 'text' },
];

// Sortable item wrapper for standard or custom field
const SortableFieldRow: React.FC<{
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}> = ({ id, index, total, onMoveUp, onMoveDown, onRemove, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-xl border transition-all duration-150 ${
        isDragging
          ? 'bg-amber-50/70 border-amber-300 shadow-md z-20'
          : 'bg-stone-50/70 border-stone-200/90 hover:border-stone-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-200/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-grab active:cursor-grabbing rounded hover:bg-stone-200/60 touch-none"
            title="Drag to reorder field"
            aria-label="Drag to reorder field"
          >
            <DragGripIcon className="w-3.5 h-3.5 text-stone-400" />
          </button>
          <span className="text-[11px] font-medium text-stone-500 font-mono">
            #{index + 1}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer rounded hover:bg-stone-200/50"
            title="Move up"
          >
            <ArrowUpIcon className="w-3 h-3" />
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={onMoveDown}
            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer rounded hover:bg-stone-200/50"
            title="Move down"
          >
            <ArrowDownIcon className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-stone-400 hover:text-red-600 cursor-pointer rounded hover:bg-red-50 ml-1"
            title="Remove field"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personal,
  onChange,
  accentColor = '#8C3A27',
}) => {
  // Normalize fields into an ordered structure
  const hiddenKeys = personal.hiddenStandardKeys || [];
  const customFields = personal.customFields || [];

  // Default ordering of standard fields if not specified
  const initialStandardKeys = STANDARD_FIELDS_DEF.map((f) => f.key);
  const currentOrder = personal.fieldOrder && personal.fieldOrder.length > 0
    ? personal.fieldOrder
    : [
        ...initialStandardKeys,
        ...customFields.map((cf) => cf.id),
      ];

  // All active items in order
  const activeItems = currentOrder
    .map((id) => {
      // Is it a standard field?
      const std = STANDARD_FIELDS_DEF.find((f) => f.key === id);
      if (std) {
        if (hiddenKeys.includes(id)) return null;
        return { isStandard: true, key: std.key, def: std, id: std.key };
      }
      // Is it a custom field?
      const custom = customFields.find((cf) => cf.id === id);
      if (custom) {
        return { isStandard: false, custom, id: custom.id };
      }
      return null;
    })
    .filter(Boolean) as Array<
      | { isStandard: true; key: string; def: StandardFieldDef; id: string }
      | { isStandard: false; custom: CustomPersonalInfoField; id: string }
    >;

  // Dnd sensor
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeIds = activeItems.map((item) => item.id);
      const oldIndex = activeIds.indexOf(String(active.id));
      const newIndex = activeIds.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        const nextActiveIds = arrayMove(activeIds, oldIndex, newIndex);
        // Preserve any hidden items at end
        const remainingHidden = hiddenKeys.filter((k) => !nextActiveIds.includes(k));
        onChange({ fieldOrder: [...nextActiveIds, ...remainingHidden] });
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const activeIds = activeItems.map((item) => item.id);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeIds.length) return;
    const nextActiveIds = arrayMove(activeIds, index, targetIdx);
    const remainingHidden = hiddenKeys.filter((k) => !nextActiveIds.includes(k));
    onChange({ fieldOrder: [...nextActiveIds, ...remainingHidden] });
  };

  // Removing / Hiding a field
  const handleRemoveField = (id: string, isStandard: boolean) => {
    if (isStandard) {
      // Mark as hidden
      const nextHidden = Array.from(new Set([...hiddenKeys, id]));
      // Also clear standard field value in state so it doesn't linger
      onChange({
        hiddenStandardKeys: nextHidden,
        [id]: id === 'dob' ? undefined : '',
      });
    } else {
      // Delete custom field
      const nextCustom = customFields.filter((cf) => cf.id !== id);
      const nextOrder = currentOrder.filter((item) => item !== id);
      onChange({ customFields: nextCustom, fieldOrder: nextOrder });
    }
  };

  // Restoring a removed standard field
  const handleRestoreStandardField = (key: string) => {
    const nextHidden = hiddenKeys.filter((k) => k !== key);
    // Append to end of active items or current order
    const nextOrder = currentOrder.includes(key) ? currentOrder : [...currentOrder, key];
    onChange({
      hiddenStandardKeys: nextHidden,
      fieldOrder: nextOrder,
    });
  };

  // Adding a new custom field
  const handleAddCustomField = () => {
    const newId = `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newField: CustomPersonalInfoField = {
      id: newId,
      label: '',
      value: '',
    };
    const nextCustom = [...customFields, newField];
    const nextOrder = [...currentOrder, newId];
    onChange({
      customFields: nextCustom,
      fieldOrder: nextOrder,
    });
  };

  // Updating a custom field
  const handleUpdateCustomField = (id: string, updates: Partial<CustomPersonalInfoField>) => {
    const nextCustom = customFields.map((cf) => {
      if (cf.id !== id) return cf;
      const updated = { ...cf, ...updates };
      // Enforce character limits: label 30, value 120
      if (updated.label && updated.label.length > 30) {
        updated.label = updated.label.slice(0, 30);
      }
      if (updated.value && updated.value.length > 120) {
        updated.value = updated.value.slice(0, 120);
      }
      return updated;
    });
    onChange({ customFields: nextCustom });
  };

  // Standard field values getter/setter
  const getStandardVal = (key: string) => {
    return (personal as any)[key] ?? '';
  };

  const setStandardVal = (key: string, val: any) => {
    onChange({ [key]: val });
  };

  // Removed standard fields available to restore
  const removedStandardFields = STANDARD_FIELDS_DEF.filter((f) => hiddenKeys.includes(f.key));

  return (
    <div className="space-y-4 pt-2">
      <p className="text-xs text-stone-500">
        Customise and reorder your personal details. Empty fields or empty labels will never appear on the resume. Standard and custom fields can be moved or removed freely.
      </p>

      {/* Sortable Field Items List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {activeItems.map((item, index) => {
              if (item.isStandard) {
                const def = item.def;
                return (
                  <SortableFieldRow
                    key={def.key}
                    id={def.key}
                    index={index}
                    total={activeItems.length}
                    onMoveUp={() => handleMove(index, 'up')}
                    onMoveDown={() => handleMove(index, 'down')}
                    onRemove={() => handleRemoveField(def.key, true)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-stone-700">
                          {def.label}
                        </label>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Standard Field
                        </span>
                      </div>

                      {def.type === 'date' ? (
                        <DatePicker
                          value={personal.dob}
                          onChange={(val) => setStandardVal('dob', val)}
                          defaultPrecision="day"
                          placeholder="e.g. 12 March 1998"
                          minYear={1940}
                          maxYear={new Date().getFullYear()}
                        />
                      ) : def.type === 'select' ? (
                        <select
                          value={getStandardVal(def.key)}
                          onChange={(e) => setStandardVal(def.key, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
                        >
                          <option value="">Select (Optional)</option>
                          {def.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={getStandardVal(def.key)}
                          onChange={(e) => setStandardVal(def.key, e.target.value)}
                          placeholder={def.placeholder}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
                        />
                      )}
                    </div>
                  </SortableFieldRow>
                );
              }

              // Custom Field Item
              const cf = item.custom;
              return (
                <SortableFieldRow
                  key={cf.id}
                  id={cf.id}
                  index={index}
                  total={activeItems.length}
                  onMoveUp={() => handleMove(index, 'up')}
                  onMoveDown={() => handleMove(index, 'down')}
                  onRemove={() => handleRemoveField(cf.id, false)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-stone-700">
                          Label
                        </label>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {cf.label.length}/30
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={30}
                        value={cf.label}
                        onChange={(e) =>
                          handleUpdateCustomField(cf.id, { label: e.target.value })
                        }
                        placeholder="e.g. Nationality / Hobbies"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
                      />
                    </div>
                    <div className="sm:col-span-7">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-stone-700">
                          Value (Plain text)
                        </label>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {cf.value.length}/120
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={120}
                        value={cf.value}
                        onChange={(e) =>
                          handleUpdateCustomField(cf.id, { value: e.target.value })
                        }
                        placeholder="e.g. Indian / Photography, Chess"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
                      />
                    </div>
                  </div>
                </SortableFieldRow>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Bottom Action Bar: Add custom field button + Restore removed fields */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/70">
        <button
          type="button"
          onClick={handleAddCustomField}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8C3A27] bg-[#8C3A27]/8 hover:bg-[#8C3A27]/15 transition-colors cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>+ Add field</span>
        </button>

        {removedStandardFields.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-500 font-medium">
              Restore removed:
            </span>
            {removedStandardFields.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => handleRestoreStandardField(f.key)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                title={`Restore ${f.label}`}
              >
                <PlusIcon className="w-2.5 h-2.5 text-stone-500" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
