import React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { hexToRgba } from '../utils/colorUtils';

// 6-dot drag grip handle icon
export const DragGripIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`shrink-0 ${className}`}
  >
    <circle cx="8" cy="6" r="1.5" />
    <circle cx="16" cy="6" r="1.5" />
    <circle cx="8" cy="12" r="1.5" />
    <circle cx="16" cy="12" r="1.5" />
    <circle cx="8" cy="18" r="1.5" />
    <circle cx="16" cy="18" r="1.5" />
  </svg>
);

interface FormSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  itemCount?: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  isHidden?: boolean;
  onToggleHide?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenIconPicker?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  id,
  title,
  icon,
  iconBgColor = '#8C3A27',
  itemCount,
  isOpen,
  onToggleOpen,
  isHidden = false,
  onToggleHide,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onOpenIconPicker,
  dragHandleProps,
  isDragging = false,
  children,
  className = '',
}) => {
  return (
    <div
      data-open={isOpen ? 'true' : 'false'}
      data-section-id={id}
      className={`section-card rounded-2xl border transition-[box-shadow,border-color] duration-150 ${
        isDragging
          ? 'opacity-60 shadow-2xl scale-[1.01] bg-stone-50 z-30 border-stone-300'
          : isHidden
          ? 'border-stone-200 opacity-60 bg-stone-50/60'
          : isOpen
          ? 'bg-white'
          : 'border-stone-200/90 hover:border-stone-300 bg-white shadow-2xs'
      } ${className}`}
      style={
        isOpen && !isHidden
          ? {
              borderColor: iconBgColor,
              boxShadow: `0 0 0 1px ${iconBgColor}, 0 2px 6px -1px rgba(0,0,0,0.06)`,
            }
          : isDragging
          ? {
              borderColor: iconBgColor,
              boxShadow: `0 0 0 1px ${iconBgColor}`,
            }
          : undefined
      }
    >
      {/* Header Bar */}
      <div
        className="p-4 sm:p-5 flex items-center justify-between gap-3 select-none cursor-pointer group rounded-t-2xl focus:outline-none focus-visible:outline-2 focus-visible:outline-[#8C3A27] focus-visible:outline-offset-2"
        onClick={onToggleOpen}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleOpen();
          }
        }}
      >
        {/* Left: Drag Handle (if draggable) + Icon Tile + Title + Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* 6-dot drag handle */}
          {dragHandleProps && (
            <button
              type="button"
              {...dragHandleProps}
              onClick={(e) => e.stopPropagation()}
              title="Drag to reorder section"
              aria-label="Drag to reorder section"
              className="p-1 text-stone-400 hover:text-stone-700 cursor-grab active:cursor-grabbing rounded hover:bg-stone-100 touch-none"
            >
              <DragGripIcon className="w-4 h-4 text-stone-400" />
            </button>
          )}

          {/* Icon Tile (Clicking opens icon picker) */}
          <button
            type="button"
            onClick={(e) => {
              if (onOpenIconPicker) {
                e.stopPropagation();
                onOpenIconPicker();
              }
            }}
            title={onOpenIconPicker ? 'Click to change section icon' : undefined}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs transition-transform ${
              onOpenIconPicker ? 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-[#8C3A27]/50 cursor-pointer' : ''
            }`}
            style={{ backgroundColor: iconBgColor }}
          >
            {icon}
          </button>

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h3 className="font-serif-ui text-base font-bold text-stone-900 truncate">
              {title}
            </h3>

            {typeof itemCount === 'number' && itemCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-medium font-mono">
                {itemCount}
              </span>
            )}

            {isHidden && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Hidden in resume
              </span>
            )}
          </div>
        </div>

        {/* Right: Section Actions (Reorder, Hide, Expand) */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Move Up */}
          {onMoveUp && (
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="Move section up"
              className={`p-1.5 rounded-lg transition-colors ${
                canMoveUp
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-stone-300 cursor-not-allowed'
              }`}
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}

          {/* Move Down */}
          {onMoveDown && (
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="Move section down"
              className={`p-1.5 rounded-lg transition-colors ${
                canMoveDown
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-stone-300 cursor-not-allowed'
              }`}
            >
              <ArrowDownIcon className="w-4 h-4" />
            </button>
          )}

          {/* Hide/Show Toggle */}
          {onToggleHide && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleHide();
              }}
              title={isHidden ? 'Show section in resume' : 'Hide section from resume'}
              className={`p-1.5 rounded-lg transition-colors ${
                isHidden
                  ? 'text-amber-600 hover:bg-amber-50'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {isHidden ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Chevron */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleOpen();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            {isOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 border-t border-stone-100 mt-1 rounded-b-2xl">
          {children}
        </div>
      )}
    </div>
  );
};
