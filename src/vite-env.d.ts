/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'html2pdf.js' {
  interface Html2Pdf {
    set(options: Record<string, any>): Html2Pdf;
    from(element: HTMLElement): Html2Pdf;
    save(): Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}
