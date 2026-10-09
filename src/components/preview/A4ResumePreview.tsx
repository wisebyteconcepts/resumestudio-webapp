import React, { useEffect, useRef, useState } from 'react';
import {
  ExclamationCircleIcon as AlertCircle,
  CheckCircleIcon as CheckCircle2,
  MinusIcon as Minus,
  PlusIcon as Plus,
  ArrowPathIcon as RotateCcw,
} from '@heroicons/react/24/outline';
import { CustomisationSettings, ResumeData } from '../../types/resume';
import { ClassicTemplate } from '../templates/ClassicTemplate';
import { ModernSidebarTemplate } from '../templates/ModernSidebarTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { CompactTemplate } from '../templates/CompactTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';

interface A4ResumePreviewProps {
  data: ResumeData;
  settings: CustomisationSettings;
  className?: string;
  onPageStatusChange?: (status: {
    fitsOnePage: boolean;
    pageCount: number;
    overflowWarning: boolean;
  }) => void;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123; // 297mm @ 96dpi

type ZoomMode = 'fit-screen' | '100' | 'custom';

export const A4ResumePreview: React.FC<A4ResumePreviewProps> = ({
  data,
  settings,
  className = '',
  onPageStatusChange,
}) => {
  const scrollPaneRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  // Pane dimensions
  const [paneSize, setPaneSize] = useState({ width: 600, height: 750 });

  // Zoom state
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const [zoomMode, setZoomMode] = useState<ZoomMode>(() => {
    try {
      const saved = localStorage.getItem('resume_studio_zoom_mode');
      if (saved && ['fit-screen', '100', 'custom'].includes(saved)) {
        return saved as ZoomMode;
      }
    } catch {}
    return isMobile ? 'fit-screen' : 'fit-screen';
  });

  const [customZoomPercent, setCustomZoomPercent] = useState<number>(100);

  // Content measurement & auto-fit
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);
  const [autoFitScale, setAutoFitScale] = useState(1);

  // Debounced measurement in requestAnimationFrame
  const measureRafRef = useRef<number | null>(null);
  const measureTimeoutRef = useRef<number | null>(null);

  // 1. ResizeObserver for pane dimensions
  useEffect(() => {
    const el = scrollPaneRef.current;
    if (!el) return;

    let resizeTimer: number;
    const observer = new ResizeObserver((entries) => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            setPaneSize({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        }
      }, 80);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(resizeTimer);
    };
  }, []);

  // 2. Debounced auto-fit height measurement (150ms in rAF)
  useEffect(() => {
    if (measureTimeoutRef.current) {
      window.clearTimeout(measureTimeoutRef.current);
    }
    if (measureRafRef.current) {
      cancelAnimationFrame(measureRafRef.current);
    }

    measureTimeoutRef.current = window.setTimeout(() => {
      measureRafRef.current = requestAnimationFrame(() => {
        const el = measurementRef.current;
        if (!el) return;

        const naturalHeight = el.scrollHeight;
        setContentHeight(naturalHeight);

        // Auto-fit calculation (tolerance <= 1123 + 2 is strictly 1 page)
        if (naturalHeight <= A4_HEIGHT_PX + 2) {
          setAutoFitScale(1);
        } else if (naturalHeight <= A4_HEIGHT_PX * 1.14) {
          // Moderate overflow: scale down gracefully
          const ratio = Math.max(0.88, A4_HEIGHT_PX / naturalHeight);
          setAutoFitScale(ratio);
        } else {
          // Flow to page 2 at readable scale
          setAutoFitScale(0.92);
        }
      });
    }, 150);

    return () => {
      if (measureTimeoutRef.current) window.clearTimeout(measureTimeoutRef.current);
      if (measureRafRef.current) cancelAnimationFrame(measureRafRef.current);
    };
  }, [data, settings]);

  // Page status: tolerance <= 1123 + 2 is strictly 1 page
  const effectiveHeight = contentHeight * autoFitScale;
  const fitsOnePage = effectiveHeight <= A4_HEIGHT_PX + 2;
  const pageCount = fitsOnePage ? 1 : Math.max(1, Math.ceil((effectiveHeight - 2) / A4_HEIGHT_PX));
  const overflowWarning = !fitsOnePage;

  useEffect(() => {
    onPageStatusChange?.({ fitsOnePage, pageCount, overflowWarning });
  }, [fitsOnePage, pageCount, overflowWarning, onPageStatusChange]);

  // Save zoom mode preference
  const handleSetZoomMode = (mode: ZoomMode) => {
    setZoomMode(mode);
    try {
      localStorage.setItem('resume_studio_zoom_mode', mode);
    } catch {}
  };

  // Zoom scale calculations (clamped 50% to 150%)
  let scale = 1;
  const paddingX = 32;
  const paddingY = 32;
  const availW = Math.max(200, paneSize.width - paddingX);
  const availH = Math.max(300, paneSize.height - paddingY);

  if (zoomMode === 'fit-screen') {
    const scaleW = availW / A4_WIDTH_PX;
    const scaleH = availH / A4_HEIGHT_PX;
    scale = Math.min(scaleW, scaleH);
    scale = Math.max(0.5, Math.min(1.5, scale));
  } else if (zoomMode === '100') {
    scale = 1.0;
  } else {
    // Custom zoom
    scale = Math.max(0.5, Math.min(1.5, customZoomPercent / 100));
  }

  const handleZoomIn = () => {
    const currentPercent = Math.round(scale * 100);
    const next = Math.min(150, Math.floor(currentPercent / 10) * 10 + 10);
    setCustomZoomPercent(next);
    handleSetZoomMode('custom');
  };

  const handleZoomOut = () => {
    const currentPercent = Math.round(scale * 100);
    const next = Math.max(50, Math.ceil(currentPercent / 10) * 10 - 10);
    setCustomZoomPercent(next);
    handleSetZoomMode('custom');
  };

  // Resolve font pair classes
  const headingFontClass =
    settings.fontPair === 'poppins-inter'
      ? 'font-pair-poppins'
      : settings.fontPair === 'playfair-sourcesans'
      ? 'font-pair-playfair'
      : 'font-pair-merriweather';

  const bodyFontClass =
    settings.fontPair === 'poppins-inter'
      ? 'font-pair-inter'
      : settings.fontPair === 'playfair-sourcesans'
      ? 'font-pair-sourcesans'
      : 'font-pair-lato';

  // Handle empty state gracefully
  const isCompletelyEmpty =
    !data.basic.fullName &&
    !data.basic.summary &&
    data.skills.length === 0 &&
    data.experience.length === 0 &&
    data.education.length === 0;

  const displayData: ResumeData = isCompletelyEmpty
    ? {
        ...data,
        basic: {
          ...data.basic,
          fullName: 'Your Full Name',
          headline: 'Professional Designation',
          email: 'your.name@example.com',
          phone: '+1 (555) 000-0000',
          summary:
            'Start typing your summary and career history in the editor on the left. Empty sections will not appear on your printed resume.',
        },
        skills: ['Key Skill 1', 'Key Skill 2', 'Core Competency'],
      }
    : data;

  // Template selector
  const renderTemplateContent = (dataset: ResumeData) => {
    const props = { data: dataset, settings, headingFontClass, bodyFontClass };
    switch (settings.templateId) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'modern-sidebar':
        return <ModernSidebarTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'professional':
        return <ProfessionalTemplate {...props} />;
      case 'compact':
        return <CompactTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      default:
        return <ModernSidebarTemplate {...props} />;
    }
  };

  const totalHeightPx = A4_HEIGHT_PX * pageCount;
  const scaledWidth = Math.round(A4_WIDTH_PX * scale);
  const scaledHeight = Math.round(totalHeightPx * scale);

  return (
    <div className={`flex flex-col h-full bg-[#EAE6DF]/70 select-none ${className}`}>
      {/* 1. Compact Zoom Toolbar */}
      <div className="shrink-0 px-3.5 py-2.5 bg-white/95 backdrop-blur-xs border-b border-stone-200/90 flex flex-wrap items-center justify-between gap-2.5 z-10 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="font-serif-ui text-stone-900 font-semibold text-xs tracking-tight">
            Live Preview
          </span>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
            A4 · 210 × 297 mm
          </span>
          {fitsOnePage ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Fits on 1 page ✓</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-medium">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Overflowing ✗ ({pageCount} pages)</span>
            </span>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200/80 text-xs">
            <button
              type="button"
              onClick={() => handleSetZoomMode('fit-screen')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                zoomMode === 'fit-screen'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fit to screen
            </button>
            <button
              type="button"
              onClick={() => handleSetZoomMode('100')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                zoomMode === '100'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              100% (Actual size)
            </button>
          </div>

          {/* Stepper buttons & percent readout */}
          <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200/80 p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom out (-10%)"
              disabled={Math.round(scale * 100) <= 50}
              className="p-1 rounded text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono font-medium text-stone-800 min-w-[40px] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom in (+10%)"
              disabled={Math.round(scale * 100) >= 150}
              className="p-1 rounded text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overflow Banner Warning */}
      {overflowWarning && (
        <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-900 z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Content exceeds a single A4 page ({pageCount} pages). Trim content
              or hide a section to guarantee 1-page fit.
            </span>
          </div>
        </div>
      )}

      {/* Empty State Hint Banner */}
      {isCompletelyEmpty && (
        <div className="bg-stone-100/90 border-b border-stone-200/80 px-4 py-1 text-[11px] text-stone-600 text-center italic shrink-0">
          Light preview placeholder shown. The exported PDF will be clean and only include what you enter.
        </div>
      )}

      {/* 2. Scroll Container: fills 100% of pane without page-level scroll */}
      <div
        ref={scrollPaneRef}
        className="flex-1 overflow-auto p-4 sm:p-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Outer Scaled Dimension Wrapper: sizes the scroll boundary accurately */}
        <div
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Inner Fixed 794px sheet transformed with CSS scale and transform-origin: top center */}
          <div
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${totalHeightPx}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
              position: 'absolute',
              top: 0,
              left: '50%',
              marginLeft: `-${A4_WIDTH_PX / 2}px`,
            }}
          >
            {/* Sheet 1 */}
            <div
              className={`bg-white shadow-xl ring-1 ring-black/5 rounded-xs relative overflow-hidden transition-all ${
                isCompletelyEmpty ? 'opacity-85' : ''
              }`}
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
              }}
            >
              {/* Scaled content for auto-fit */}
              <div
                style={{
                  transform: `scale(${autoFitScale})`,
                  transformOrigin: 'top left',
                  width: `${100 / autoFitScale}%`,
                }}
              >
                {renderTemplateContent(displayData)}
              </div>

              {/* Page 1 indicator badge if multi-page */}
              {!fitsOnePage && (
                <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-stone-900/70 text-white text-[9px] font-mono tracking-wider pointer-events-none">
                  Page 1 / {pageCount}
                </div>
              )}
            </div>

            {/* Stacked Sheet 2 (if overflowing onto Page 2) */}
            {!fitsOnePage && (
              <div className="mt-8 relative">
                <div
                  className="bg-white shadow-xl ring-1 ring-black/5 rounded-xs relative overflow-hidden"
                  style={{
                    width: `${A4_WIDTH_PX}px`,
                    height: `${A4_HEIGHT_PX}px`,
                  }}
                >
                  {/* Slice of page 2 content */}
                  <div
                    style={{
                      transform: `scale(${autoFitScale}) translateY(-${A4_HEIGHT_PX}px)`,
                      transformOrigin: 'top left',
                      width: `${100 / autoFitScale}%`,
                    }}
                  >
                    {renderTemplateContent(displayData)}
                  </div>

                  <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-stone-900/70 text-white text-[9px] font-mono tracking-wider pointer-events-none">
                    Page 2 / {pageCount}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Unscaled DOM container used solely for auto-fit height measurement */}
      <div
        ref={measurementRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: `${A4_WIDTH_PX}px`,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {renderTemplateContent(data)}
      </div>
    </div>
  );
};
