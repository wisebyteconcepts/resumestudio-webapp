import React, { useEffect, useRef, useState } from 'react';
import { DatePrecision, DateValue } from '../../types/resume';
import {
  MONTH_NAMES_FULL,
  MONTH_NAMES_SHORT,
  formatDateValue,
  parseToDateValue,
} from '../../utils/dateFormatter';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value?: DateValue | string | null;
  onChange: (val: DateValue | undefined) => void;
  defaultPrecision?: DatePrecision;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
  disabled?: boolean;
  accentColor?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  defaultPrecision = 'day',
  placeholder = 'Select date',
  minYear = 1940,
  maxYear = new Date().getFullYear() + 10,
  className = '',
  disabled = false,
  accentColor = '#8C3A27',
  id,
}) => {
  // Parsed current structured date
  const parsedValue = parseToDateValue(value, defaultPrecision);

  // Active precision for this field
  const [precision, setPrecision] = useState<DatePrecision>(
    parsedValue?.precision || defaultPrecision
  );

  // Popover open state
  const [isOpen, setIsOpen] = useState(false);

  // Calendar navigation state
  const today = new Date();
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>(
    precision === 'year' ? 'year' : precision === 'month' ? 'month' : 'day'
  );
  const [navYear, setNavYear] = useState<number>(
    parsedValue?.year || today.getFullYear()
  );
  const [navMonth, setNavMonth] = useState<number>(
    parsedValue?.month || today.getMonth() + 1
  );

  // Text input typing state
  const [inputText, setInputText] = useState<string>(
    parsedValue ? formatDateValue(parsedValue) : ''
  );
  const [inputError, setInputError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerInputRef = useRef<HTMLInputElement>(null);

  // Keep input text in sync when value changes externally
  useEffect(() => {
    if (parsedValue) {
      setInputText(formatDateValue(parsedValue));
      setPrecision(parsedValue.precision);
      setInputError(null);
    } else if (!value) {
      setInputText('');
      setInputError(null);
    }
  }, [value]);

  // Adjust viewMode when precision changes or popover opens
  useEffect(() => {
    if (isOpen) {
      if (precision === 'year') setViewMode('year');
      else if (precision === 'month') setViewMode('month');
      else setViewMode('day');

      if (parsedValue) {
        setNavYear(parsedValue.year);
        if (parsedValue.month) setNavMonth(parsedValue.month);
      } else {
        setNavYear(today.getFullYear());
        setNavMonth(today.getMonth() + 1);
      }
    }
  }, [isOpen, precision]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (!text.trim()) {
      setInputError(null);
      onChange(undefined);
      return;
    }

    const parsed = parseToDateValue(text, precision);
    if (!parsed) {
      setInputError('Invalid date format');
      return;
    }

    if (parsed.year < minYear || parsed.year > maxYear) {
      setInputError(`Year must be between ${minYear} and ${maxYear}`);
      return;
    }

    setInputError(null);
    setPrecision(parsed.precision);
    onChange(parsed);
  };

  // Select day
  const handleSelectDay = (day: number) => {
    const newVal: DateValue = {
      precision: 'day',
      year: navYear,
      month: navMonth,
      day,
    };
    onChange(newVal);
    setInputText(formatDateValue(newVal));
    setInputError(null);
    setIsOpen(false);
  };

  // Select month
  const handleSelectMonth = (mIndex1: number) => {
    if (precision === 'month') {
      const newVal: DateValue = {
        precision: 'month',
        year: navYear,
        month: mIndex1,
      };
      onChange(newVal);
      setInputText(formatDateValue(newVal));
      setInputError(null);
      setIsOpen(false);
    } else {
      setNavMonth(mIndex1);
      setViewMode('day');
    }
  };

  // Select year
  const handleSelectYear = (y: number) => {
    if (precision === 'year') {
      const newVal: DateValue = {
        precision: 'year',
        year: y,
      };
      onChange(newVal);
      setInputText(formatDateValue(newVal));
      setInputError(null);
      setIsOpen(false);
    } else {
      setNavYear(y);
      setViewMode(precision === 'month' ? 'month' : 'day');
    }
  };

  // Precision toggle inside popover
  const handlePrecisionChange = (newP: DatePrecision) => {
    setPrecision(newP);
    if (newP === 'year') {
      setViewMode('year');
      if (parsedValue) {
        const newVal: DateValue = { precision: 'year', year: parsedValue.year };
        onChange(newVal);
        setInputText(formatDateValue(newVal));
      }
    } else if (newP === 'month') {
      setViewMode('month');
      if (parsedValue) {
        const newVal: DateValue = {
          precision: 'month',
          year: parsedValue.year,
          month: parsedValue.month || 1,
        };
        onChange(newVal);
        setInputText(formatDateValue(newVal));
      }
    } else {
      setViewMode('day');
      if (parsedValue) {
        const newVal: DateValue = {
          precision: 'day',
          year: parsedValue.year,
          month: parsedValue.month || 1,
          day: parsedValue.day || 1,
        };
        onChange(newVal);
        setInputText(formatDateValue(newVal));
      }
    }
  };

  // Stepper navigation
  const handlePrev = () => {
    if (viewMode === 'day') {
      if (navMonth === 1) {
        setNavMonth(12);
        setNavYear((y) => Math.max(minYear, y - 1));
      } else {
        setNavMonth((m) => m - 1);
      }
    } else if (viewMode === 'month') {
      setNavYear((y) => Math.max(minYear, y - 1));
    } else {
      // decade
      setNavYear((y) => Math.max(minYear, y - 10));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      if (navMonth === 12) {
        setNavMonth(1);
        setNavYear((y) => Math.min(maxYear, y + 1));
      } else {
        setNavMonth((m) => m + 1);
      }
    } else if (viewMode === 'month') {
      setNavYear((y) => Math.min(maxYear, y + 1));
    } else {
      setNavYear((y) => Math.min(maxYear, y + 10));
    }
  };

  // Calendar Day Generation
  const daysInMonth = new Date(navYear, navMonth, 0).getDate();
  const firstDayWeekday = (new Date(navYear, navMonth - 1, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const prevMonthDays = new Date(navYear, navMonth - 1, 0).getDate();

  // Decade Range
  const decadeStart = Math.floor(navYear / 10) * 10;
  const decadeYears = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  // Keyboard navigation inside popover
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerInputRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field with Calendar Trigger */}
      <div className="relative flex items-center">
        <input
          ref={triggerInputRef}
          id={id}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-3 pr-16 py-1.5 rounded-lg border text-xs text-stone-900 bg-white font-sans transition-colors focus:outline-none ${
            inputError
              ? 'border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border-stone-200 focus:border-[#8C3A27] focus:ring-1 focus:ring-[#8C3A27]'
          } ${disabled ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : ''}`}
        />

        <div className="absolute right-1 flex items-center gap-0.5">
          {inputText && !disabled && (
            <button
              type="button"
              onClick={() => {
                setInputText('');
                setInputError(null);
                onChange(undefined);
              }}
              title="Clear date"
              className="p-1 text-stone-400 hover:text-stone-600 rounded"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            disabled={disabled}
            title="Open calendar"
            className="p-1 text-stone-500 hover:text-stone-800 rounded transition-colors"
          >
            <CalendarIcon className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {inputError && (
        <p className="mt-1 text-[10px] text-red-600 font-medium">
          {inputError}
        </p>
      )}

      {/* Popover / Mobile Bottom Sheet */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/30 z-40 sm:hidden backdrop-blur-2xs"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={popoverRef}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Date picker"
            className="fixed bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-auto sm:absolute sm:top-full sm:left-0 mt-1 z-50 bg-[#FDFBF7] p-4 rounded-t-2xl sm:rounded-2xl border border-stone-200/90 shadow-xl w-full sm:w-[290px] animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Header: Precision Segmented Control */}
            <div className="flex items-center justify-between gap-1 p-0.5 mb-3 bg-stone-200/70 rounded-lg text-[10px] font-semibold text-stone-600">
              <button
                type="button"
                onClick={() => handlePrecisionChange('day')}
                className={`flex-1 py-1 rounded transition-colors ${
                  precision === 'day'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'hover:text-stone-900'
                }`}
              >
                Full date
              </button>
              <button
                type="button"
                onClick={() => handlePrecisionChange('month')}
                className={`flex-1 py-1 rounded transition-colors ${
                  precision === 'month'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'hover:text-stone-900'
                }`}
              >
                Month & Year
              </button>
              <button
                type="button"
                onClick={() => handlePrecisionChange('year')}
                className={`flex-1 py-1 rounded transition-colors ${
                  precision === 'year'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'hover:text-stone-900'
                }`}
              >
                Year only
              </button>
            </div>

            {/* Stepper Navigation & View Switcher */}
            <div className="flex items-center justify-between mb-2 px-1">
              <button
                type="button"
                onClick={handlePrev}
                title="Previous"
                className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (viewMode === 'day') setViewMode('month');
                  else if (viewMode === 'month') setViewMode('year');
                  else setViewMode('day');
                }}
                className="text-xs font-serif-ui font-bold text-stone-900 hover:text-[#8C3A27] px-2 py-0.5 rounded transition-colors"
              >
                {viewMode === 'day' && `${MONTH_NAMES_FULL[navMonth - 1]} ${navYear}`}
                {viewMode === 'month' && `${navYear}`}
                {viewMode === 'year' && `${decadeStart} – ${decadeStart + 9}`}
              </button>

              <button
                type="button"
                onClick={handleNext}
                title="Next"
                className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode: Day Grid */}
            {viewMode === 'day' && (
              <div role="grid" aria-label="Month calendar">
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-stone-400 mb-1">
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                  <span>Su</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs">
                  {/* Leading empty days */}
                  {Array.from({ length: firstDayWeekday }).map((_, i) => (
                    <span
                      key={`prev-${i}`}
                      className="h-7 flex items-center justify-center text-stone-300 text-[11px]"
                    >
                      {prevMonthDays - firstDayWeekday + i + 1}
                    </span>
                  ))}

                  {/* Active month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected =
                      parsedValue?.precision === 'day' &&
                      parsedValue.year === navYear &&
                      parsedValue.month === navMonth &&
                      parsedValue.day === day;
                    const isToday =
                      today.getFullYear() === navYear &&
                      today.getMonth() + 1 === navMonth &&
                      today.getDate() === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={`h-7 w-7 mx-auto flex items-center justify-center rounded-lg text-xs font-sans transition-all ${
                          isSelected
                            ? 'text-white font-bold shadow-xs'
                            : isToday
                            ? 'text-[#8C3A27] font-semibold ring-1 ring-[#8C3A27]/40 bg-white'
                            : 'text-stone-800 hover:bg-stone-200/60'
                        }`}
                        style={isSelected ? { backgroundColor: accentColor } : undefined}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Mode: Month Grid (3x4) */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-3 gap-2 py-1">
                {MONTH_NAMES_SHORT.map((name, idx) => {
                  const m1 = idx + 1;
                  const isSelected =
                    parsedValue?.year === navYear && parsedValue?.month === m1;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectMonth(m1)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'text-white font-bold shadow-xs'
                          : 'text-stone-800 bg-white border border-stone-200/60 hover:border-stone-400'
                      }`}
                      style={isSelected ? { backgroundColor: accentColor } : undefined}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* View Mode: Year Grid (4x3) */}
            {viewMode === 'year' && (
              <div className="grid grid-cols-3 gap-2 py-1 max-h-52 overflow-y-auto pr-1">
                {decadeYears.map((y) => {
                  const isSelected = parsedValue?.year === y;
                  const isCurrentDecade = y >= decadeStart && y < decadeStart + 10;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleSelectYear(y)}
                      className={`py-2 rounded-xl text-xs font-medium font-sans transition-all ${
                        isSelected
                          ? 'text-white font-bold shadow-xs'
                          : isCurrentDecade
                          ? 'text-stone-900 bg-white border border-stone-200/60 hover:border-stone-400'
                          : 'text-stone-400 bg-transparent'
                      }`}
                      style={isSelected ? { backgroundColor: accentColor } : undefined}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Popover Footer: Today & Clear */}
            <div className="mt-3 pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  const nowVal: DateValue =
                    precision === 'year'
                      ? { precision: 'year', year: today.getFullYear() }
                      : precision === 'month'
                      ? {
                          precision: 'month',
                          year: today.getFullYear(),
                          month: today.getMonth() + 1,
                        }
                      : {
                          precision: 'day',
                          year: today.getFullYear(),
                          month: today.getMonth() + 1,
                          day: today.getDate(),
                        };
                  onChange(nowVal);
                  setInputText(formatDateValue(nowVal));
                  setInputError(null);
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-[#8C3A27] hover:underline"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setInputText('');
                  setInputError(null);
                  setIsOpen(false);
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
