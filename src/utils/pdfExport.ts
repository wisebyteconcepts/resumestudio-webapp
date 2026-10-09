export interface PdfExportResult {
  success: boolean;
  filename?: string;
  error?: string;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// Standalone safe CSS for the isolated iframe (100% HEX/RGB, NO Tailwind OKLCH variables)
const ISOLATED_RESUME_CSS = `
  *, ::before, ::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    background-color: #ffffff !important;
    color: #1c1917 !important;
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    width: 794px;
    margin: 0 !important;
    padding: 0 !important;
  }

  #export-root {
    width: 794px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    background-color: #ffffff;
  }

  /* Single-page strict constraint */
  #export-root.single-page-sheet {
    height: 1123px !important;
    min-height: 1123px !important;
    max-height: 1123px !important;
  }

  .inner-page-wrapper {
    width: 100%;
    box-sizing: border-box;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Font classes */
  .font-pair-poppins { font-family: 'Poppins', sans-serif !important; }
  .font-pair-inter { font-family: 'Inter', sans-serif !important; }
  .font-pair-playfair { font-family: 'Playfair Display', Georgia, serif !important; }
  .font-pair-sourcesans { font-family: 'Source Sans 3', sans-serif !important; }
  .font-pair-merriweather { font-family: 'Merriweather', Georgia, serif !important; }
  .font-pair-lato { font-family: 'Lato', sans-serif !important; }

  /* Pure HEX Color utility classes */
  .text-stone-950 { color: #0c0a09 !important; }
  .text-stone-900 { color: #1c1917 !important; }
  .text-stone-800 { color: #292524 !important; }
  .text-stone-700 { color: #44403c !important; }
  .text-stone-600 { color: #57534e !important; }
  .text-stone-500 { color: #78716c !important; }
  .text-stone-400 { color: #a8a29e !important; }
  .text-stone-300 { color: #d6d3d1 !important; }
  .text-stone-200 { color: #e7e5e4 !important; }
  .text-white { color: #ffffff !important; }
  .text-red-500 { color: #ef4444 !important; }
  .text-emerald-600 { color: #059669 !important; }

  .bg-white { background-color: #ffffff !important; }
  .bg-stone-50 { background-color: #fafaf9 !important; }
  .bg-stone-100 { background-color: #f5f5f4 !important; }
  .bg-stone-200 { background-color: #e7e5e4 !important; }
  .bg-stone-300 { background-color: #d6d3d1 !important; }
  .bg-stone-400 { background-color: #a8a29e !important; }
  .bg-stone-700 { background-color: #44403c !important; }
  .bg-stone-800 { background-color: #292524 !important; }
  .bg-stone-900 { background-color: #1c1917 !important; }

  .border-stone-100 { border-color: #f5f5f4 !important; }
  .border-stone-200 { border-color: #e7e5e4 !important; }
  .border-stone-300 { border-color: #d6d3d1 !important; }
  .border-stone-400 { border-color: #a8a29e !important; }
  .border-white { border-color: #ffffff !important; }
  .border { border-width: 1px !important; border-style: solid !important; }
  .border-t { border-top-width: 1px !important; border-top-style: solid !important; }
  .border-b { border-bottom-width: 1px !important; border-bottom-style: solid !important; }
  .border-b-2 { border-bottom-width: 2px !important; border-bottom-style: solid !important; }
  .border-l { border-left-width: 1px !important; border-left-style: solid !important; }
  .border-r { border-right-width: 1px !important; border-right-style: solid !important; }
  .border-2 { border-width: 2px !important; border-style: solid !important; }

  /* Layout & Flexbox */
  .flex { display: flex !important; }
  .inline-flex { display: inline-flex !important; }
  .flex-col { flex-direction: column !important; }
  .flex-wrap { flex-wrap: wrap !important; }
  .flex-1 { flex: 1 1 0% !important; }
  .shrink-0 { flex-shrink: 0 !important; }
  .items-center { align-items: center !important; }
  .items-start { align-items: flex-start !important; }
  .items-end { align-items: flex-end !important; }
  .items-baseline { align-items: baseline !important; }
  .justify-between { justify-content: space-between !important; }
  .justify-center { justify-content: center !important; }
  .justify-end { justify-content: flex-end !important; }

  /* Grid */
  .grid { display: grid !important; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
  .col-span-5 { grid-column: span 5 / span 5 !important; }
  .col-span-7 { grid-column: span 7 / span 7 !important; }

  /* Spacing */
  .gap-1 { gap: 0.25rem !important; }
  .gap-1\\.5 { gap: 0.375rem !important; }
  .gap-2 { gap: 0.5rem !important; }
  .gap-2\\.5 { gap: 0.625rem !important; }
  .gap-3 { gap: 0.75rem !important; }
  .gap-4 { gap: 1rem !important; }
  .gap-5 { gap: 1.25rem !important; }
  .gap-6 { gap: 1.5rem !important; }
  .gap-x-1 { column-gap: 0.25rem !important; }
  .gap-x-2 { column-gap: 0.5rem !important; }
  .gap-x-3 { column-gap: 0.75rem !important; }
  .gap-x-4 { column-gap: 1rem !important; }
  .gap-y-1 { row-gap: 0.25rem !important; }
  .gap-y-1\\.5 { row-gap: 0.375rem !important; }

  .space-y-0\\.5 > * + * { margin-top: 0.125rem !important; }
  .space-y-1 > * + * { margin-top: 0.25rem !important; }
  .space-y-2 > * + * { margin-top: 0.5rem !important; }
  .space-y-2\\.5 > * + * { margin-top: 0.625rem !important; }
  .space-y-3 > * + * { margin-top: 0.75rem !important; }
  .space-y-4 > * + * { margin-top: 1rem !important; }

  /* Dimensions */
  .w-full { width: 100% !important; }
  .h-full { height: 100% !important; }
  .min-h-full { min-height: 100% !important; }
  .w-\\[34\\%\\] { width: 34% !important; }
  .w-\\[66\\%\\] { width: 66% !important; }
  .w-1\\.5 { width: 0.375rem !important; } .h-4\\.5 { height: 1.125rem !important; }
  .w-2\\.5 { width: 0.625rem !important; } .h-2\\.5 { height: 0.625rem !important; }
  .w-3 { width: 0.75rem !important; } .h-3 { height: 0.75rem !important; }
  .w-3\\.5 { width: 0.875rem !important; } .h-3\\.5 { height: 0.875rem !important; }
  .w-4 { width: 1rem !important; } .h-4 { height: 1rem !important; }
  .w-5 { width: 1.25rem !important; } .h-5 { height: 1.25rem !important; }
  .w-7 { width: 1.75rem !important; }
  .w-8 { width: 2rem !important; } .h-8 { height: 2rem !important; }
  .w-13 { width: 3.25rem !important; } .h-13 { height: 3.25rem !important; }
  .w-16 { width: 4rem !important; } .h-16 { height: 4rem !important; }
  .w-20 { width: 5rem !important; } .h-20 { height: 5rem !important; }
  .w-22 { width: 5.5rem !important; } .h-22 { height: 5.5rem !important; }
  .w-24 { width: 6rem !important; } .h-24 { height: 6rem !important; }
  .w-48 { width: 12rem !important; } .h-48 { height: 12rem !important; }
  .h-9 { height: 2.25rem !important; }
  .h-11 { height: 2.75rem !important; }
  .h-\\[1px\\] { height: 1px !important; }
  .h-\\[2px\\] { height: 2px !important; }
  .h-3\\.5 { height: 0.875rem !important; }
  .max-w-\\[130px\\] { max-width: 130px !important; }
  .max-h-full { max-height: 100% !important; }
  .max-w-full { max-width: 100% !important; }

  /* Radii */
  .rounded-xs { border-radius: 0.125rem !important; }
  .rounded-sm { border-radius: 0.125rem !important; }
  .rounded { border-radius: 0.25rem !important; }
  .rounded-md { border-radius: 0.375rem !important; }
  .rounded-lg { border-radius: 0.5rem !important; }
  .rounded-xl { border-radius: 0.75rem !important; }
  .rounded-2xl { border-radius: 1rem !important; }
  .rounded-full { border-radius: 9999px !important; }
  .rounded-bl-xl { border-bottom-left-radius: 0.75rem !important; }

  /* Padding & Margins */
  .p-0\\.5 { padding: 0.125rem !important; }
  .p-6 { padding: 1.5rem !important; }
  .p-7 { padding: 1.75rem !important; }
  .p-8 { padding: 2rem !important; }
  .p-9 { padding: 2.25rem !important; }
  .p-10 { padding: 2.5rem !important; }
  .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
  .py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
  .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
  .px-8 { padding-left: 2rem !important; padding-right: 2rem !important; }
  .py-6 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
  .pt-0 { padding-top: 0 !important; }
  .pt-1 { padding-top: 0.25rem !important; }
  .pt-3 { padding-top: 0.75rem !important; }
  .pb-1 { padding-bottom: 0.25rem !important; }
  .pb-1\\.5 { padding-bottom: 0.375rem !important; }
  .pb-2\\.5 { padding-bottom: 0.625rem !important; }
  .pb-3 { padding-bottom: 0.75rem !important; }
  .pb-4 { padding-bottom: 1rem !important; }
  .pb-5 { padding-bottom: 1.25rem !important; }
  .pl-4 { padding-left: 1rem !important; }
  .pl-5 { padding-left: 1.25rem !important; }

  .mx-auto { margin-left: auto !important; margin-right: auto !important; }
  .mb-1 { margin-bottom: 0.25rem !important; }
  .mb-2 { margin-bottom: 0.5rem !important; }
  .mb-3 { margin-bottom: 0.75rem !important; }
  .mb-3\\.5 { margin-bottom: 0.875rem !important; }
  .mb-4 { margin-bottom: 1rem !important; }
  .mb-5 { margin-bottom: 1.25rem !important; }
  .mb-6 { margin-bottom: 1.5rem !important; }
  .mt-0\\.5 { margin-top: 0.125rem !important; }
  .mt-1 { margin-top: 0.25rem !important; }
  .mt-1\\.5 { margin-top: 0.375rem !important; }
  .mt-2 { margin-top: 0.5rem !important; }
  .mt-3 { margin-top: 0.75rem !important; }
  .mt-4 { margin-top: 1rem !important; }
  .mt-5 { margin-top: 1.25rem !important; }

  /* Typography */
  .text-center { text-align: center !important; }
  .text-right { text-align: right !important; }
  .text-justify { text-align: justify !important; }
  .font-light { font-weight: 300 !important; }
  .font-normal { font-weight: 400 !important; }
  .font-medium { font-weight: 500 !important; }
  .font-semibold { font-weight: 600 !important; }
  .font-bold { font-weight: 700 !important; }
  .font-extrabold { font-weight: 800 !important; }
  .uppercase { text-transform: uppercase !important; }
  .italic { font-style: italic !important; }

  .text-\\[8px\\] { font-size: 8px !important; }
  .text-\\[8\\.5px\\] { font-size: 8.5px !important; }
  .text-\\[9px\\] { font-size: 9px !important; }
  .text-\\[9\\.5px\\] { font-size: 9.5px !important; }
  .text-\\[10px\\] { font-size: 10px !important; }
  .text-\\[10\\.5px\\] { font-size: 10.5px !important; }
  .text-\\[11px\\] { font-size: 11px !important; }
  .text-\\[11\\.5px\\] { font-size: 11.5px !important; }
  .text-\\[12px\\] { font-size: 12px !important; }
  .text-\\[12\\.5px\\] { font-size: 12.5px !important; }
  .text-\\[13px\\] { font-size: 13px !important; }
  .text-\\[22px\\] { font-size: 22px !important; }
  .text-\\[25px\\] { font-size: 25px !important; }
  .text-\\[26px\\] { font-size: 26px !important; }
  .text-\\[27px\\] { font-size: 27px !important; }
  .text-\\[29px\\] { font-size: 29px !important; }

  .leading-none { line-height: 1 !important; }
  .leading-tight { line-height: 1.25 !important; }
  .leading-snug { line-height: 1.375 !important; }
  .leading-relaxed { line-height: 1.625 !important; }

  .tracking-tight { letter-spacing: -0.025em !important; }
  .tracking-wide { letter-spacing: 0.025em !important; }
  .tracking-wider { letter-spacing: 0.05em !important; }
  .tracking-widest { letter-spacing: 0.1em !important; }
  .tracking-\\[0\\.15em\\] { letter-spacing: 0.15em !important; }
  .tracking-\\[0\\.2em\\] { letter-spacing: 0.2em !important; }

  .object-cover { object-fit: cover !important; }
  .object-contain { object-fit: contain !important; }
  .relative { position: relative !important; }
  .absolute { position: absolute !important; }
  .top-0 { top: 0 !important; }
  .right-0 { right: 0 !important; }
  .inset-0 { inset: 0 !important; }
  .-inset-1 { inset: -0.25rem !important; }
  .overflow-hidden { overflow: hidden !important; }
  .list-disc { list-style-type: disc !important; }
  .list-outside { list-style-position: outside !important; }
  .break-all { word-break: break-all !important; }
  .inline-block { display: inline-block !important; }
  .truncate { overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }

  /* Keep resume section blocks together across page boundaries */
  .resume-section-item {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
`;

export async function downloadPdfFile(fullName: string): Promise<PdfExportResult> {
  const cleanName = (fullName || 'My').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName || 'Resume'}_Resume.pdf`;

  // 1. Get the source container from DOM
  const sourceEl = document.getElementById('printable-resume-container');
  if (!sourceEl) {
    return {
      success: false,
      error: 'Printable resume container not found in DOM',
    };
  }

  // 2. Lazy load heavy PDF libraries only when user initiates download
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);

  // 3. Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-99999px';
  iframe.style.top = '0';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';

  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Unable to access export iframe document');
    }

    // 4. Inject font links and isolated pure CSS (no Tailwind oklch variables)
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Lato:wght@400;700&family=Lora:wght@400;600;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@500;600;700&family=Poppins:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet" />
          <style>${ISOLATED_RESUME_CSS}</style>
        </head>
        <body>
          <div id="export-root">
            <div class="inner-page-wrapper">${sourceEl.innerHTML}</div>
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // 5. Await document fonts and images to be ready
    if (iframeDoc.fonts) {
      try {
        await iframeDoc.fonts.ready;
      } catch {
        // Continue even if font probe times out
      }
    }

    // Wait for all images inside iframe to complete loading
    const images = Array.from(iframeDoc.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );

    // Small rendering tick
    await new Promise((resolve) => setTimeout(resolve, 100));

    const exportRoot = iframeDoc.getElementById('export-root');
    if (!exportRoot) {
      throw new Error('Export root element not found in isolated frame');
    }

    // 6. Measure real content height with el.scrollHeight (tolerance 2px)
    const contentHeightPx = exportRoot.scrollHeight;
    const isSinglePage = contentHeightPx <= 1123 + 2;

    if (isSinglePage) {
      exportRoot.classList.add('single-page-sheet');
    }

    // 7. Render with html2canvas-pro
    const canvas = await html2canvas(exportRoot, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: isSinglePage ? 1123 : contentHeightPx,
      windowWidth: 794,
      windowHeight: isSinglePage ? 1123 : contentHeightPx,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // Safety net: strip any @supports or unsupported colour functions
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((style) => {
          if (style.textContent) {
            style.textContent = style.textContent
              .replace(/@supports\s*\([^{]+\)\s*\{[^}]*\}/gi, '')
              .replace(/oklch\([^)]+\)/gi, '#1c1917')
              .replace(/color-mix\([^)]+\)/gi, '#1c1917')
              .replace(/lab\([^)]+\)/gi, '#1c1917')
              .replace(/oklab\([^)]+\)/gi, '#1c1917');
          }
        });

        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const styleAttr = el.getAttribute('style');
          if (styleAttr && /oklch|color-mix|lab\(|oklab/i.test(styleAttr)) {
            el.setAttribute(
              'style',
              styleAttr
                .replace(/oklch\([^)]+\)/gi, '#1c1917')
                .replace(/color-mix\([^)]+\)/gi, '#1c1917')
            );
          }
        });
      },
    });

    // 8. Build the A4 jsPDF (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const imgHeightMm = (canvas.height * pageWidthMm) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    if (isSinglePage || imgHeightMm <= pageHeightMm + 1) {
      // STRICT SINGLE PAGE: Exactly one page, clamped to 297mm. Do NOT call addPage()!
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
    } else {
      // MULTI-PAGE
      const totalPages = Math.max(1, Math.ceil((contentHeightPx - 2) / 1123));
      let heightLeftMm = imgHeightMm;
      let positionMm = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, positionMm, pageWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeftMm -= pageHeightMm;

      // Subsequent pages (skip if remaining height is less than ~8px / ~2mm of content)
      for (let p = 1; p < totalPages; p++) {
        if (heightLeftMm <= 2.5) break; // Skip trailing blank or tiny sliver
        positionMm -= pageHeightMm;
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, positionMm, pageWidthMm, imgHeightMm, undefined, 'FAST');
        heightLeftMm -= pageHeightMm;
      }
    }

    // 9. Output blob and download
    const blob = pdf.output('blob');
    downloadBlob(blob, filename);

    return { success: true, filename };
  } catch (err) {
    console.error('Direct PDF export error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate PDF',
    };
  } finally {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }
}

export async function triggerBrowserPrint(fullName: string): Promise<void> {
  const cleanName = (fullName || 'My').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const targetTitle = `${cleanName}_Resume`;
  const originalTitle = document.title;

  try {
    document.title = targetTitle;
    await new Promise((resolve) => setTimeout(resolve, 80));
    window.print();
  } catch (e) {
    console.warn('Browser print failed:', e);
  } finally {
    setTimeout(() => {
      document.title = originalTitle;
    }, 1200);
  }
}
