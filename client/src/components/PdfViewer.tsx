import { useEffect, useMemo, useState } from "react";

type PdfViewerProps = {
  url: string | null;
  title?: string;
  className?: string;
};

export default function PdfViewer({ url, title = "Visualização de PDF", className = "" }: PdfViewerProps) {
  const [embedFailed, setEmbedFailed] = useState(false);

  const safeUrl = useMemo(() => {
    if (!url) return "";
    if (url.includes("#")) return `${url}&toolbar=0&navpanes=0&scrollbar=0`;
    return `${url}#toolbar=0&navpanes=0&scrollbar=0`;
  }, [url]);

  useEffect(() => {
    setEmbedFailed(false);
  }, [safeUrl]);

  if (!safeUrl) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#0b1220] text-sm text-muted-foreground ${className}`}>
        Carregando documento...
      </div>
    );
  }

  if (embedFailed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-6 text-center text-sm text-muted-foreground ${className}`}>
        <p>O navegador não conseguiu renderizar o PDF em tela.</p>
        <a
          href={safeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-background"
        >
          Abrir PDF em nova aba
        </a>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-2 ${className}`}>
      <embed
        src={safeUrl}
        type="application/pdf"
        title={title}
        className="h-full w-full rounded-lg border-0 bg-white"
        onError={() => setEmbedFailed(true)}
      />
    </div>
  );
}
