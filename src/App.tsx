/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  DataActionType,
  DataConfirmModal,
} from './components/DataConfirmModal';
import { LandingHero } from './components/LandingHero';
import { PrintableResume } from './components/PrintableResume';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_EMPTY_RESUME,
  DEFAULT_SETTINGS,
  SAMPLE_PRIYA_SHARMA,
} from './data/sampleData';
import {
  CustomisationSettings,
  ResumeData,
  TemplateId,
} from './types/resume';
import { downloadPdfFile, triggerBrowserPrint } from './utils/pdfExport';
import {
  clearLocalStorage,
  exportBackupJSON,
  loadSavedResume,
  loadSavedSettings,
  saveResumeAndSettings,
  validateAndParseBackup,
} from './utils/storage';

// Lazy-load the editor component to keep initial landing page bundle tiny
const LazyResumeEditor = React.lazy(() =>
  import('./components/ResumeEditor').then((module) => ({
    default: module.ResumeEditor,
  }))
);

// Lightweight editor loading skeleton
function EditorLoadingSkeleton() {
  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-44 bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between">
            <div className="h-5 bg-stone-200 rounded w-1/3" />
            <div className="h-10 bg-stone-100 rounded-xl w-full" />
            <div className="h-8 bg-stone-100 rounded-xl w-2/3" />
          </div>
          <div className="h-64 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4">
            <div className="h-5 bg-stone-200 rounded w-1/4" />
            <div className="h-10 bg-stone-100 rounded-xl w-full" />
            <div className="h-10 bg-stone-100 rounded-xl w-full" />
          </div>
        </div>
        {/* Right Preview Skeleton */}
        <div className="lg:col-span-6 h-[720px] bg-white rounded-2xl border border-stone-200/80 p-8 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8C3A27]/10 text-[#8C3A27] mx-auto flex items-center justify-center font-serif-ui font-bold">
              R
            </div>
            <p className="font-serif-ui text-sm text-stone-700 font-semibold">
              Loading Resume Studio Atelier...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<ResumeData>(() => loadSavedResume());
  const [settings, setSettings] = useState<CustomisationSettings>(() =>
    loadSavedSettings()
  );
  const [step, setStep] = useState<'landing' | 'editor'>('landing');
  const [isSaved, setIsSaved] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [dataConfirmAction, setDataConfirmAction] =
    useState<DataActionType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastUndo, setToastUndo] = useState<(() => void) | null>(null);
  const [editorSessionKey, setEditorSessionKey] = useState<number>(0);

  // Auto-save debounce timer (500 ms)
  const saveTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string, undoAction?: () => void) => {
    setToastMessage(msg);
    setToastUndo(undoAction ? () => undoAction : null);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      setToastUndo(null);
    }, 6000);
  };

  // Debounced auto-save effect (500 ms)
  useEffect(() => {
    setIsSaved(false);

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      const res = saveResumeAndSettings(data, settings);
      if (res.success) {
        setIsSaved(true);
      } else {
        console.warn('Storage save warning:', res.error);
        setIsSaved(true);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, settings]);

  const hasSavedData = Boolean(
    data.basic.fullName?.trim() ||
      data.basic.summary?.trim() ||
      data.experience.length > 0 ||
      data.skills.length > 0
  );

  // Start Blank execution
  const executeStartBlank = (tplId?: TemplateId) => {
    if (tplId) {
      setSettings((prev) => ({ ...prev, templateId: tplId }));
    }
    setData({
      ...DEFAULT_EMPTY_RESUME,
      declaration: {
        ...DEFAULT_EMPTY_RESUME.declaration,
        date: new Date().toISOString().split('T')[0],
      },
    });
    setEditorSessionKey((k) => k + 1);
    setStep('editor');
    showToast('Started with a blank resume.');
  };

  // Start with sample data (optionally specifying template)
  const handleStartWithSample = (tplId?: TemplateId) => {
    if (tplId) {
      setSettings((prev) => ({
        ...prev,
        templateId: tplId,
      }));
    }
    setData(SAMPLE_PRIYA_SHARMA);
    setEditorSessionKey((k) => k + 1);
    setStep('editor');
    showToast('Loaded Priya Sharma sample resume.');
  };

  // Continue editing with optional template switch
  const handleContinueEditing = (tplId?: TemplateId) => {
    if (tplId) {
      setSettings((prev) => ({ ...prev, templateId: tplId }));
    }
    setStep('editor');
  };

  // Open editor with chosen template
  const handleOpenTemplate = (tplId: TemplateId) => {
    setSettings((prev) => ({ ...prev, templateId: tplId }));
    if (!hasSavedData) {
      setData(DEFAULT_EMPTY_RESUME);
    }
    setEditorSessionKey((k) => k + 1);
    setStep('editor');
  };

  // Download backup JSON
  const handleDownloadBackup = () => {
    exportBackupJSON(data, settings);
    showToast('Backup JSON downloaded successfully.');
  };

  // Restore backup from file with Undo
  const handleRestoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      const result = validateAndParseBackup(content);
      if (result.success && result.data) {
        const prevDataSnapshot = JSON.parse(JSON.stringify(data));
        const prevSettingsSnapshot = JSON.parse(JSON.stringify(settings));

        setData(result.data);
        if (result.settings) {
          setSettings(result.settings);
        }
        setEditorSessionKey((k) => k + 1);
        setStep('editor');
        showToast('Resume data restored from backup file.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          setEditorSessionKey((k) => k + 1);
          showToast('Restored previous resume state.');
        });
      } else {
        showToast(result.error || 'Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Execute confirmed data action with Undo support
  const handleConfirmDataAction = () => {
    if (!dataConfirmAction) return;

    const action = dataConfirmAction;
    setDataConfirmAction(null);

    const prevDataSnapshot = JSON.parse(JSON.stringify(data));
    const prevSettingsSnapshot = JSON.parse(JSON.stringify(settings));

    setEditorSessionKey((k) => k + 1);

    switch (action) {
      case 'load-sample': {
        setData(SAMPLE_PRIYA_SHARMA);
        showToast('Loaded Priya Sharma sample resume.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          showToast('Restored previous resume state.');
        });
        break;
      }
      case 'start-blank': {
        setData({
          ...DEFAULT_EMPTY_RESUME,
          declaration: {
            ...DEFAULT_EMPTY_RESUME.declaration,
            date: new Date().toISOString().split('T')[0],
          },
        });
        showToast('Started with a blank resume.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          showToast('Restored previous resume state.');
        });
        break;
      }
      case 'reload-saved': {
        const savedData = loadSavedResume();
        const savedSettings = loadSavedSettings();
        setData(savedData);
        setSettings(savedSettings);
        showToast('Reloaded last saved draft from browser.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          showToast('Restored previous resume state.');
        });
        break;
      }
      case 'reset-design': {
        setSettings({
          ...DEFAULT_SETTINGS,
          templateId: settings.templateId,
        });
        showToast('Reset design settings to defaults.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          showToast('Restored previous resume state.');
        });
        break;
      }
      case 'clear-everything': {
        setData(DEFAULT_EMPTY_RESUME);
        setSettings(DEFAULT_SETTINGS);
        clearLocalStorage();
        showToast('All resume data and settings cleared.', () => {
          setData(prevDataSnapshot);
          setSettings(prevSettingsSnapshot);
          showToast('Restored previous resume state.');
        });
        break;
      }
    }
  };

  // Direct PDF Download (Strict 1-page A4 format)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const result = await downloadPdfFile(data.basic.fullName);
      if (result.success) {
        showToast(`Downloaded ${result.filename || 'Resume.pdf'}`);
      } else {
        showToast(result.error || 'Failed to download PDF.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF file.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print option
  const handlePrintViaBrowser = () => {
    triggerBrowserPrint(data.basic.fullName);
  };

  const handleSelectTemplate = (tplId: TemplateId) => {
    setSettings((prev) => ({ ...prev, templateId: tplId }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      {/* Printable Resume Container: Rendered for print engine only (off-screen) */}
      <PrintableResume data={data} settings={settings} />

      {/* Screen UI: Hidden during print */}
      <div className="no-print flex flex-col flex-1">
        {step === 'landing' ? (
          <LandingHero
            settings={settings}
            hasSavedData={hasSavedData}
            onSelectTemplate={handleSelectTemplate}
            onStartBlank={executeStartBlank}
            onStartWithSample={handleStartWithSample}
            onContinueEditing={handleContinueEditing}
            onRestoreBackup={handleRestoreBackup}
            onOpenTemplate={handleOpenTemplate}
          />
        ) : (
          <>
            {/* Editor Top Bar with unified Data dropdown */}
            <TopBar
              isSaved={isSaved}
              isGeneratingPdf={isGeneratingPdf}
              onRequestStartBlank={() => setDataConfirmAction('start-blank')}
              onRequestLoadSample={() => setDataConfirmAction('load-sample')}
              onRequestReloadSaved={() => setDataConfirmAction('reload-saved')}
              onRequestResetDesign={() => setDataConfirmAction('reset-design')}
              onRequestClearEverything={() =>
                setDataConfirmAction('clear-everything')
              }
              onDownloadBackup={handleDownloadBackup}
              onRestoreBackup={handleRestoreBackup}
              onDownloadPdf={handleDownloadPdf}
              onPrintViaBrowser={handlePrintViaBrowser}
              onGoToLanding={() => setStep('landing')}
              currentStep={step}
            />

            {/* Breadcrumb / Mode Nav when in Editor */}
            <nav
              aria-label="Breadcrumb navigation"
              className="bg-[#EFECE5]/80 border-b border-stone-200/70 px-4 sm:px-6 py-2"
            >
              <div className="max-w-[1520px] mx-auto flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('landing')}
                    className="hover:text-stone-900 transition-colors font-medium flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27] rounded"
                  >
                    <span>← Atelier Overview</span>
                  </button>
                  <span className="text-stone-300">/</span>
                  <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-none">
                    Editing: {data.basic.fullName?.trim() || 'Untitled Resume'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('landing')}
                    className="px-2.5 py-1 rounded-md bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 transition-colors text-[11px] font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]"
                  >
                    Change Template ({settings.templateId})
                  </button>
                </div>
              </div>
            </nav>

            {/* Lazy-loaded Editor */}
            <main className="flex-1">
              <Suspense fallback={<EditorLoadingSkeleton />}>
                <LazyResumeEditor
                  key={editorSessionKey}
                  data={data}
                  settings={settings}
                  onUpdateData={setData}
                  onUpdateSettings={setSettings}
                  onToast={showToast}
                />
              </Suspense>
            </main>
          </>
        )}
      </div>

      {/* Unified Data Confirmation Modal with backup-first and undo */}
      <DataConfirmModal
        isOpen={dataConfirmAction !== null}
        actionType={dataConfirmAction}
        onClose={() => setDataConfirmAction(null)}
        onConfirm={handleConfirmDataAction}
        onDownloadBackupFirst={() => {
          handleDownloadBackup();
          handleConfirmDataAction();
        }}
      />

      {/* Toast Alert with working Undo action */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium shadow-xl border border-stone-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>

          {toastUndo && (
            <button
              type="button"
              onClick={() => {
                const undo = toastUndo;
                setToastMessage(null);
                setToastUndo(null);
                undo();
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs transition-colors ring-1 ring-amber-400/40 cursor-pointer"
            >
              Undo
            </button>
          )}
        </aside>
      )}
    </div>
  );
}
