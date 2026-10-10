import React, { useEffect, useRef, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  CircleStackIcon,
  DocumentPlusIcon,
  EllipsisHorizontalIcon,
  PrinterIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface TopBarProps {
  isSaved: boolean;
  isGeneratingPdf: boolean;
  onRequestStartBlank: () => void;
  onRequestLoadSample: () => void;
  onRequestReloadSaved: () => void;
  onRequestResetDesign: () => void;
  onRequestClearEverything: () => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (file: File) => void;
  onDownloadPdf: () => void;
  onPrintViaBrowser: () => void;
  onGoToLanding?: () => void;
  currentStep: 'landing' | 'editor';
}

export const TopBar: React.FC<TopBarProps> = ({
  isSaved,
  isGeneratingPdf,
  onRequestStartBlank,
  onRequestLoadSample,
  onRequestReloadSaved,
  onRequestResetDesign,
  onRequestClearEverything,
  onDownloadBackup,
  onRestoreBackup,
  onDownloadPdf,
  onPrintViaBrowser,
  onGoToLanding,
  currentStep,
}) => {
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataButtonRef = useRef<HTMLButtonElement>(null);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDataMenuOpen(false);
        setPdfMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRestoreBackup(file);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex items-center gap-2 text-left group transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27] rounded-lg"
            title="Go to Atelier Overview"
          >
            <div className="w-7 h-7 rounded-xl bg-[#8C3A27] text-white flex items-center justify-center font-serif-ui font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-ui text-sm font-bold tracking-tight text-stone-900 group-hover:text-[#8C3A27] transition-colors">
                  Resume Studio
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-600">
                  A4
                </span>
              </div>
            </div>
          </button>

          {/* All changes saved status */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-stone-300/80 text-xs text-stone-500">
            {isSaved ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All changes saved</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Saving changes...</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2.5">
          {/* Desktop "Data" Dropdown Button */}
          <div className="relative hidden sm:block">
            <button
              ref={dataButtonRef}
              type="button"
              onClick={() => setDataMenuOpen(!dataMenuOpen)}
              aria-expanded={dataMenuOpen}
              aria-haspopup="true"
              aria-label="Resume Data options"
              className="px-3.5 py-1.5 rounded-full border border-stone-300/90 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
            >
              <CircleStackIcon className="w-3.5 h-3.5 text-[#8C3A27]" />
              <span>Data</span>
              <ChevronDownIcon
                className={`w-3 h-3 text-stone-500 transition-transform duration-150 ${
                  dataMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dataMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDataMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 p-1.5 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* GROUP 1: LOAD */}
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-stone-400 uppercase">
                    Load
                  </div>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onRequestLoadSample();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <SparklesIcon className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Load sample data
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Fills Priya Sharma sample
                      </div>
                    </div>
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onRequestStartBlank();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <DocumentPlusIcon className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Start blank
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Empties all content fields
                      </div>
                    </div>
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <ArrowUpTrayIcon className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Restore from backup file…
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Open a .json backup file
                      </div>
                    </div>
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onRequestReloadSaved();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <ArrowPathIcon className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Reload last saved
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Revert to last browser save
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-stone-100 my-1.5" />

                  {/* GROUP 2: BACKUP & EXPORT */}
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-stone-400 uppercase">
                    Backup & Export
                  </div>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onDownloadBackup();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-stone-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Download backup JSON
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Export full data & settings
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-stone-100 my-1.5" />

                  {/* GROUP 3: RESET */}
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-stone-400 uppercase">
                    Reset
                  </div>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onRequestResetDesign();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2.5 text-stone-700 hover:text-stone-900 cursor-pointer transition-colors focus:bg-stone-100 focus:outline-none"
                  >
                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Reset design only
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Keep data, reset styling
                      </div>
                    </div>
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setDataMenuOpen(false);
                      onRequestClearEverything();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2.5 cursor-pointer transition-colors focus:bg-red-50 focus:outline-none"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-red-700">
                        Clear everything
                      </div>
                      <div className="text-[10px] text-red-400">
                        Empty data and reset design
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Hidden File Input for Restore */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Primary Action Button: Direct PDF Download with drop options */}
          <div className="relative flex items-center">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={onDownloadPdf}
              className={`px-4 py-2 rounded-l-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27] ${
                isGeneratingPdf ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Preparing PDF...</span>
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Dropdown toggle for alternative print option */}
            <button
              type="button"
              onClick={() => setPdfMenuOpen(!pdfMenuOpen)}
              title="More export options"
              aria-label="More export options"
              aria-expanded={pdfMenuOpen}
              className="px-2 py-2 bg-[#292524] hover:bg-stone-700 text-white rounded-r-xl border-l border-stone-700 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
            >
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {pdfMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPdfMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 p-1.5 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfMenuOpen(false);
                      onDownloadPdf();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-800 font-medium cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-[#8C3A27]" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Download PDF file
                      </div>
                      <div className="text-[10px] text-stone-500 font-normal">
                        Direct .pdf file export
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfMenuOpen(false);
                      onPrintViaBrowser();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-800 cursor-pointer"
                  >
                    <PrinterIcon className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        Print / Save via Browser
                      </div>
                      <div className="text-[10px] text-stone-500 font-normal">
                        Browser vector print dialog
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Overflow Menu Button (⋯) */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="More options"
              aria-expanded={mobileMenuOpen}
              className="w-9 h-9 rounded-xl border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>

            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-20 text-xs space-y-1 max-h-[85vh] overflow-y-auto">
                  <div className="px-2 py-1 text-[11px] text-stone-400 font-mono">
                    {isSaved ? 'All changes saved' : 'Saving...'}
                  </div>

                  <div className="px-2 pt-2 text-[10px] font-mono font-semibold tracking-wider text-stone-400 uppercase">
                    Data Options
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestLoadSample();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <SparklesIcon className="w-4 h-4 text-amber-600" />
                    <span>Load sample data</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestStartBlank();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <DocumentPlusIcon className="w-4 h-4 text-stone-500" />
                    <span>Start blank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <ArrowUpTrayIcon className="w-4 h-4 text-stone-500" />
                    <span>Restore from backup file…</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestReloadSaved();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <ArrowPathIcon className="w-4 h-4 text-stone-500" />
                    <span>Reload last saved</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onDownloadBackup();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-stone-500" />
                    <span>Download backup JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestResetDesign();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-stone-500" />
                    <span>Reset design only</span>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onPrintViaBrowser();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-stone-700 cursor-pointer"
                  >
                    <PrinterIcon className="w-4 h-4 text-stone-500" />
                    <span>Print via Browser</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestClearEverything();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                    <span>Clear everything</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
