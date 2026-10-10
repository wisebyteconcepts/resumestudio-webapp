import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
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
import { QualificationItem } from '../../types/resume';
import { DatePicker } from '../common/DatePicker';
import { formatYearValueRange } from '../../utils/dateFormatter';
import { DragGripIcon } from '../FormSection';

interface QualificationsFormProps {
  qualifications: QualificationItem[];
  onChange: (updatedQual: QualificationItem[]) => void;
  onToast?: (msg: string, undoAction?: () => void) => void;
}

const SortableQualificationItemCard: React.FC<{
  item: QualificationItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onUpdate: (updated: Partial<QualificationItem>) => void;
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

  const summaryTitle = [item.name, item.issuingAuthority || item.institute]
    .filter(Boolean)
    .join(' · ') || 'Untitled qualification';

  const dateSummary = formatYearValueRange(item.from, item.to, item.isCurrent, {
    fromYear: item.fromYear,
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
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder qualification"
            aria-label="Drag to reorder qualification"
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
            title="Delete qualification"
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
          {/* Qualification Name */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Qualification / Certification Name *
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect – Associate"
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
            />
          </div>

          {/* Institute & Issuing Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Institute (Optional)
              </label>
              <input
                type="text"
                value={item.institute}
                onChange={(e) => onUpdate({ institute: e.target.value })}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Issuing Authority (Optional)
              </label>
              <input
                type="text"
                value={item.issuingAuthority}
                onChange={(e) => onUpdate({ issuingAuthority: e.target.value })}
                placeholder="e.g. AWS Global Certification"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
          </div>

          {/* Years & Currently Pursuing & Result */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Year From
              </label>
              <DatePicker
                value={item.from || (item.fromYear ? item.fromYear : undefined)}
                onChange={(val) => onUpdate({ from: val })}
                defaultPrecision="year"
                placeholder="e.g. 2021"
                minYear={1970}
                maxYear={new Date().getFullYear() + 5}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Year To
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-[11px] text-stone-600">
                  <input
                    type="checkbox"
                    checked={item.isCurrent}
                    onChange={(e) => onUpdate({ isCurrent: e.target.checked })}
                    className="w-3 h-3 rounded text-[#8C3A27] focus:ring-[#8C3A27]"
                  />
                  <span>Active</span>
                </label>
              </div>

              {!item.isCurrent ? (
                <DatePicker
                  value={item.to || (item.toYear ? item.toYear : undefined)}
                  onChange={(val) => onUpdate({ to: val })}
                  defaultPrecision="year"
                  placeholder="e.g. 2024"
                  minYear={1970}
                  maxYear={new Date().getFullYear() + 10}
                />
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-500">
                  Ongoing / Active
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Result / Status (Optional)
              </label>
              <input
                type="text"
                value={item.result}
                onChange={(e) => onUpdate({ result: e.target.value })}
                placeholder="e.g. Certified / Active"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const QualificationsForm: React.FC<QualificationsFormProps> = ({
  qualifications,
  onChange,
  onToast,
}) => {
  // Collapsed state tracking (UI state only): all entries collapsed by default; newly added entries still open expanded
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

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
    qualifications.forEach((item) => {
      next[item.id] = true;
    });
    setOpenMap(next);
  };

  const handleCollapseAll = () => {
    setOpenMap({});
  };

  const handleAddItem = () => {
    const newId = `qual-${Date.now()}`;
    const currentYear = new Date().getFullYear();
    const newItem: QualificationItem = {
      id: newId,
      name: '',
      institute: '',
      issuingAuthority: '',
      from: { precision: 'year', year: currentYear - 1 },
      to: { precision: 'year', year: currentYear + 2 },
      isCurrent: true,
      result: '',
    };
    onChange([...qualifications, newItem]);
    setOpenMap((prev) => ({ ...prev, [newId]: true }));
  };

  const handleUpdateItem = (id: string, updated: Partial<QualificationItem>) => {
    onChange(
      qualifications.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    const deletedIndex = qualifications.findIndex((item) => item.id === id);
    const deletedItem = qualifications[deletedIndex];
    if (!deletedItem) return;

    const remaining = qualifications.filter((item) => item.id !== id);
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
    if (targetIdx < 0 || targetIdx >= qualifications.length) return;
    onChange(arrayMove(qualifications, index, targetIdx));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = qualifications.findIndex((item) => item.id === active.id);
      const newIndex = qualifications.findIndex((item) => item.id === over.id);
      onChange(arrayMove(qualifications, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {qualifications.length > 0 && (
        <div className="flex items-center justify-between pb-1 text-[11px] text-stone-500">
          <span>{qualifications.length} credentials</span>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={qualifications.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5">
            {qualifications.map((item, idx) => (
              <SortableQualificationItemCard
                key={item.id}
                item={item}
                index={idx}
                total={qualifications.length}
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
        Add Professional Qualification
      </button>
    </div>
  );
};
