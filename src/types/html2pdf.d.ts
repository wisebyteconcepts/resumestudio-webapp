declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: 'jpeg' | 'png' | 'webp' | (string & {}); quality?: number };
    enableLinks?: boolean;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string | null;
      windowWidth?: number;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: 'portrait' | 'landscape';
      compress?: boolean;
      [key: string]: unknown;
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  }

  interface Html2PdfWorker {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement | string): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    outputPdf(type: 'blob' | 'datauristring' | 'bloburi'): Promise<Blob | string>;
    toPdf(): Html2PdfWorker;
    get(type: string): Promise<unknown>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfWorker;

  export default html2pdf;
}
