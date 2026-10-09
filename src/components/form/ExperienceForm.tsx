import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
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
import { ExperienceItem } from '../../types/resume';
import { DatePicker } from '../common/DatePicker';
import { formatDateValueRange } from '../../utils/dateFormatter';
import { DragGripIcon } from '../FormSection';

interface ExperienceFormProps {
  experience: ExperienceItem[];
  onChange: (updatedExperience: ExperienceItem[]) => void;
  onToast?: (msg: string, undoAction?: () => void) => void;
}

// Collapsible Sortable Sub-card for Experience Item
const SortableExperienceItemCard: React.FC<{
  item: ExperienceItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onUpdate: (updated: Partial<ExperienceItem>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({
  item,
  index,
  total,
  isOpen,
  onToggleOpen,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Responsibilities bullet management
  const handleAddResponsibility = () => {
    onUpdate({
      responsibilities: [...(item.responsibilities || []), ''],
    });
  };

  const handleUpdateResponsibility = (rIdx: number, value: string) => {
    const next = [...(item.responsibilities || [])];
    next[rIdx] = value;
    onUpdate({ responsibilities: next });
  };

  const handleRemoveResponsibility = (rIdx: number) => {
    const next = (item.responsibilities || []).filter((_, i) => i !== rIdx);
    onUpdate({ responsibilities: next });
  };

  const summaryTitle = [item.designation, item.organisation]
    .filter(Boolean)
    .join(' · ') || 'Untitled experience';

  const dateSummary = formatDateValueRange(item.from, item.to, item.isCurrent, {
    fromMonth: item.fromMonth,
    fromYear: item.fromYear,
    toMonth: item.toMonth,
    toYear: item.toYear,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all ${
        isDragging
          ? 'opacity-60 shadow-lg border-[#8C3A27] bg-stone-50 z-20'
          : isOpen
          ? 'border-stone-300 bg-white shadow-xs'
          : 'border-stone-200/90 bg-stone-50/70 hover:border-stone-300'
      }`}
    >
      {/* Collapsed Header / Summary Row */}
      <div
        className="p-3 sm:p-3.5 flex items-center justify-between gap-2 select-none cursor-pointer"
        onClick={onToggleOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder role"
            aria-label="Drag to reorder role"
            className="p-1 text-stone-400 hover:text-stone-700 cursor-grab active:cursor-grabbing rounded touch-none"
          >
            <DragGripIcon className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-stone-800 truncate">
              {summaryTitle}
            </h4>
            {dateSummary && (
              <p className="text-[11px] text-stone-500 font-medium">
                {dateSummary}
              </p>
            )}
          </div>
        </div>

        {/* Right actions: up/down, delete, expand */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Move up"
            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded"
          >
            <ArrowUpIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            title="Move down"
            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded"
          >
            <ArrowDownIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete role"
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
          >
            {isOpen ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Form Body */}
      {isOpen && (
        <div className="p-3 sm:p-4 pt-0 border-t border-stone-100 mt-1 space-y-3.5">
          {/* Organisation & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Organisation / Company *
              </label>
              <input
                type="text"
                value={item.organisation}
                onChange={(e) => onUpdate({ organisation: e.target.value })}
                placeholder="e.g. Razorpay Technologies"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Designation / Job Title *
              </label>
              <input
                type="text"
                value={item.designation}
                onChange={(e) => onUpdate({ designation: e.target.value })}
                placeholder="e.g. Lead Frontend Architect"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
          </div>

          {/* Dates & Currently working here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* From Date */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                From (Month & Year)
              </label>
              <DatePicker
                value={
                  item.from ||
                  (item.fromYear
                    ? `${item.fromMonth || 'Jan'} ${item.fromYear}`
                    : undefined)
                }
                onChange={(val) => onUpdate({ from: val })}
                defaultPrecision="month"
                placeholder="e.g. Jan 2022"
                minYear={1970}
                maxYear={new Date().getFullYear()}
              />
            </div>

            {/* To Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  To (Month & Year)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-600">
                  <input
                    type="checkbox"
                    checked={item.isCurrent}
                    onChange={(e) => onUpdate({ isCurrent: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-[#8C3A27] focus:ring-[#8C3A27] cursor-pointer"
                  />
                  <span>Presently working here</span>
                </label>
              </div>

              {!item.isCurrent ? (
                <DatePicker
                  value={
                    item.to ||
                    (item.toYear
                      ? `${item.toMonth || 'Jan'} ${item.toYear}`
                      : undefined)
                  }
                  onChange={(val) => onUpdate({ to: val })}
                  defaultPrecision="month"
                  placeholder="e.g. Dec 2023"
                  minYear={1970}
                  maxYear={new Date().getFullYear() + 1}
                />
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-500 font-medium">
                  Present (Ongoing role)
                </div>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Key Responsibilities / Impact Bullets (Optional)
            </label>
            <div className="space-y-2">
              {item.responsibilities?.map((resp, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2">
                  <span className="text-stone-400 mt-1.5 text-xs">•</span>
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) =>
                      handleUpdateResponsibility(rIdx, e.target.value)
                    }
                    placeholder="e.g. Led design token architecture and cut checkout TTI by 42%"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(rIdx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddResponsibility}
              className="mt-2 text-xs font-medium text-[#8C3A27] hover:underline flex items-center gap-1"
            >
              <PlusIcon className="w-3 h-3" />
              Add responsibility
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  onChange,
  onToast,
}) => {
  // Collapsed state tracking (UI state only)
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    // First entry open by default
    const map: Record<string, boolean> = {};
    if (experience.length > 0) {
      map[experience[0].id] = true;
    }
    return map;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggle = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    experience.forEach((item) => {
      next[item.id] = true;
    });
    setOpenMap(next);
  };

  const handleCollapseAll = () => {
    setOpenMap({});
  };

  const handleAddItem = () => {
    const newId = `exp-${Date.now()}`;
    const newItem: ExperienceItem = {
      id: newId,
      organisation: '',
      designation: '',
      from: {
        precision: 'month',
        year: new Date().getFullYear() - 1,
        month: 1,
      },
      isCurrent: true,
      responsibilities: [''],
    };
    onChange([...experience, newItem]);
    setOpenMap((prev) => ({ ...prev, [newId]: true }));
  };

  const handleUpdateItem = (id: string, updated: Partial<ExperienceItem>) => {
    onChange(
      experience.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    const deletedIndex = experience.findIndex((item) => item.id === id);
    const deletedItem = experience[deletedIndex];
    if (!deletedItem) return;

    const remaining = experience.filter((item) => item.id !== id);
    onChange(remaining);

    if (onToast) {
      onToast('Entry removed. Undo', () => {
        const restored = [...remaining];
        restored.splice(deletedIndex, 0, deletedItem);
        onChange(restored);
        setOpenMap((prev) => ({ ...prev, [deletedItem.id]: true }));
      });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experience.length) return;
    onChange(arrayMove(experience, index, targetIdx));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = experience.findIndex((item) => item.id === active.id);
      const newIndex = experience.findIndex((item) => item.id === over.id);
      onChange(arrayMove(experience, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Top Controls: Expand all / Collapse all */}
      {experience.length > 0 && (
        <div className="flex items-center justify-between pb-1 text-[11px] text-stone-500">
          <span>{experience.length} total roles</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="text-[#8C3A27] hover:underline font-medium"
            >
              Expand all
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-stone-500 hover:text-stone-800"
            >
              Collapse all
            </button>
          </div>
        </div>
      )}

      {/* Drag-sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={experience.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5">
            {experience.map((item, idx) => (
              <SortableExperienceItemCard
                key={item.id}
                item={item}
                index={idx}
                total={experience.length}
                isOpen={!!openMap[item.id]}
                onToggleOpen={() => handleToggle(item.id)}
                onUpdate={(upd) => handleUpdateItem(item.id, upd)}
                onDelete={() => handleDeleteItem(item.id)}
                onMoveUp={() => handleMove(idx, 'up')}
                onMoveDown={() => handleMove(idx, 'down')}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2.5 rounded-xl border border-dashed border-stone-300 text-xs font-medium text-stone-700 hover:border-stone-500 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
      >
        <PlusIcon className="w-4 h-4 text-[#8C3A27]" />
        Add Work Experience
      </button>
    </div>
  );
};
