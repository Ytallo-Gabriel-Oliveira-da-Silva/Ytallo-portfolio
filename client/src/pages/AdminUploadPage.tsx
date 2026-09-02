import { ChangeEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, FileUp, Lock, ShieldCheck, UploadCloud } from "lucide-react";

type UploadMeta = {
  name: string;
  size: number;
  type: string;
};

type CertificateItem = UploadMeta & {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  institution?: string;
  status?: string;
  url?: string;
  hasImage?: boolean;
};

type ManifestState = {
  curriculos: {
    pt: UploadMeta | null;
    en: UploadMeta | null;
  };
  certificados: Record<string, CertificateItem>;
};

const initialSelected: Record<string, UploadMeta | null> = {
  curriculoPt: null,
  curriculoEn: null,
  certificadoKey: null,
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function AdminUploadPage() {
  const [, setLocation] = useLocation();
  const [manifest, setManifest] = useState<ManifestState>({
    curriculos: { pt: null, en: null },
    certificados: {},
  });
  const [certificateId, setCertificateId] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [certificateSlug, setCertificateSlug] = useState("");
  const [certificateInstitution, setCertificateInstitution] = useState("");
  const [certificateStatus, setCertificateStatus] = useState("Disponível");
  const [certificateHasImage, setCertificateHasImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadMeta | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [token, setToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundCertificate, setFoundCertificate] = useState<CertificateItem | null>(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);

  useEffect(() => {
    if (!isUnlocked) return;

    fetch("/api/admin/manifest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não autorizado");
        return res.json();
      })
      .then((data) => setManifest(data))
      .catch(() => {
        setStatus("Sessão inválida. Verifique a chave de acesso.");
        setIsUnlocked(false);
      });
  }, [isUnlocked, token]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (key === "certificadoArquivo") {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      });
      return;
    }

    setManifest((current) => {
      const next = { ...current };
      if (key === "curriculoPt") {
        next.curriculos.pt = {
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
        };
      }
      if (key === "curriculoEn") {
        next.curriculos.en = {
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
        };
      }
      return next;
    });
  };

  const applyCertificateForm = (item: CertificateItem | null) => {
    if (!item) {
      return;
    }

    setFoundCertificate(item);
    setSelectedCertificateId(item.id || null);
    setCertificateId(item.id || "");
    setCertificateName(item.name || item.title || "");
    setCertificateSlug(item.slug || "");
    setCertificateInstitution(item.institution || "");
    setCertificateStatus(item.status || "Disponível");
    setCertificateHasImage(Boolean(item.hasImage));
  };

  const handleCertificateSearch = async () => {
    const query = searchQuery.trim();

    try {
      const response = await fetch(`/api/admin/certificado?q=${encodeURIComponent(query || "")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.item) {
        setFoundCertificate(null);
        setSelectedCertificateId(null);
        setStatus(query ? "Nenhum certificado encontrado com esse identificador." : "Digite um ID, slug ou nome para procurar.");
        return;
      }

      applyCertificateForm(result.item);
      setStatus("Item localizado com sucesso. Você pode editar ou trocar o arquivo.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao buscar item.");
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    const fileInput = document.getElementById("curriculoPt") as HTMLInputElement | null;
    const fileInputEn = document.getElementById("curriculoEn") as HTMLInputElement | null;
    const certInput = document.getElementById("certificadoArquivo") as HTMLInputElement | null;

    if (fileInput?.files?.[0]) formData.append("curriculoPt", fileInput.files[0]);
    if (fileInputEn?.files?.[0]) formData.append("curriculoEn", fileInputEn.files[0]);
    if (certInput?.files?.[0]) {
      formData.append("certificadoArquivo", certInput.files[0]);
    }

    if (certificateId.trim()) formData.append("certificadoId", certificateId.trim());
    if (certificateName.trim()) formData.append("certificadoName", certificateName.trim());
    if (certificateSlug.trim()) formData.append("certificadoSlug", certificateSlug.trim());
    if (certificateInstitution.trim()) formData.append("certificadoInstitution", certificateInstitution.trim());
    if (certificateStatus.trim()) formData.append("certificadoStatus", certificateStatus.trim());
    formData.append("certificadoHasImage", String(certificateHasImage));

    if (!formData.has("curriculoPt") && !formData.has("curriculoEn") && !formData.has("certificadoArquivo")) {
      setStatus("Selecione pelo menos um arquivo antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar arquivo");
      }

      const result = await response.json();
      setStatus(result.message || "Arquivo enviado com sucesso.");
      setSelectedFile(null);
      setCertificateId("");
      setCertificateName("");
      setCertificateSlug("");
      setCertificateInstitution("");
      setCertificateStatus("Disponível");
      setCertificateHasImage(false);
      setSearchQuery("");
      setFoundCertificate(null);
      setSelectedCertificateId(null);
      if (certInput) certInput.value = "";
      if (fileInput) fileInput.value = "";
      if (fileInputEn) fileInputEn.value = "";
      const refreshed = await fetch("/api/admin/manifest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const latest = await refreshed.json();
      setManifest(latest);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao enviar arquivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-[0_0_25px_rgba(0,217,255,0.08)]">
          <div className="mb-6 flex items-center gap-3 text-primary">
            <Lock size={20} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Área restrita</span>
          </div>

          <h1 className="text-3xl font-black">Central de arquivos</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Essa área não fica vinculada ao menu principal do site. Use essa rota direta apenas para gestão interna.
          </p>

          <label className="mt-6 block text-sm font-medium text-foreground">
            Chave de acesso
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Digite a chave"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            onClick={() => setIsUnlocked(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-background"
          >
            <ShieldCheck size={16} />
            Entrar na central
          </button>

          <button
            onClick={() => setLocation("/")}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground"
          >
            <ArrowLeft size={16} />
            Voltar para o site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-[0_0_30px_rgba(0,217,255,0.08)] md:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Admin</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Central de arquivos</h1>
          </div>

          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Site
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <FileUp size={18} />
              <h2 className="text-lg font-bold">Currículos</h2>
            </div>

            {[
              { key: "curriculoPt", label: "Currículo — Português: adicionar" },
              { key: "curriculoEn", label: "Currículo — Inglês: adicionar" },
            ].map((field) => (
              <div key={field.key} className="mb-5 rounded-xl border border-border bg-card p-4">
                <label className="mb-2 block text-sm font-medium text-foreground">{field.label}</label>
                <input
                  id={field.key}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) => handleFileChange(event, field.key)}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                />

                {manifest.curriculos[field.key === "curriculoPt" ? "pt" : "en"] && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                    <p><strong>Arquivo:</strong> {manifest.curriculos[field.key === "curriculoPt" ? "pt" : "en"]?.name}</p>
                    <p><strong>Tipo:</strong> {manifest.curriculos[field.key === "curriculoPt" ? "pt" : "en"]?.type}</p>
                    <p><strong>Tamanho:</strong> {formatFileSize(manifest.curriculos[field.key === "curriculoPt" ? "pt" : "en"]?.size ?? 0)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <UploadCloud size={18} />
              <h2 className="text-lg font-bold">Certificados</h2>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Pesquisar por ID, slug ou nome"
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={handleCertificateSearch}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background"
                >
                  Buscar
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {Object.keys(manifest.certificados).length > 0 && (
                  <div className="rounded-lg border border-border bg-background/50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Lista atual</p>
                    <div className="max-h-40 space-y-2 overflow-auto text-xs text-muted-foreground">
                      {Object.values(manifest.certificados).map((item) => (
                        <button
                          key={item.id || item.slug || item.name}
                          type="button"
                          onClick={() => applyCertificateForm(item)}
                          className={`block w-full rounded-md border px-2 py-2 text-left transition-colors ${
                            selectedCertificateId === (item.id || item.slug)
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          <span className="font-semibold text-foreground">{item.id || item.slug}</span> • {item.name || item.title || item.slug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block text-sm font-medium text-foreground">
                  ID do certificado
                  <input
                    value={certificateId}
                    onChange={(event) => setCertificateId(event.target.value)}
                    placeholder="ex: cert-001"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block text-sm font-medium text-foreground">
                  Nome
                  <input
                    value={certificateName}
                    onChange={(event) => setCertificateName(event.target.value)}
                    placeholder="Ex: Certificado de UX"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block text-sm font-medium text-foreground">
                  Slug automático
                  <input
                    value={certificateSlug}
                    onChange={(event) => setCertificateSlug(event.target.value)}
                    placeholder="ex: certificado-de-ux"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block text-sm font-medium text-foreground">
                  Instituição / Ensino
                  <input
                    value={certificateInstitution}
                    onChange={(event) => setCertificateInstitution(event.target.value)}
                    placeholder="Ex: Alura"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block text-sm font-medium text-foreground">
                  Status
                  <input
                    value={certificateStatus}
                    onChange={(event) => setCertificateStatus(event.target.value)}
                    placeholder="Disponível"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="inline-flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={certificateHasImage}
                    onChange={(event) => setCertificateHasImage(event.target.checked)}
                  />
                  Este certificado tem imagem / capa
                </label>
              </div>

              <label className="mt-4 mb-2 block text-sm font-medium text-foreground">Arquivo do certificado</label>
              <input
                id="certificadoArquivo"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => handleFileChange(event, "certificadoArquivo")}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
              />

              {selectedFile && (
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                  <p><strong>Arquivo:</strong> {selectedFile.name}</p>
                  <p><strong>Tipo:</strong> {selectedFile.type}</p>
                  <p><strong>Tamanho:</strong> {formatFileSize(selectedFile.size)}</p>
                </div>
              )}

              {foundCertificate && (
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                  <p><strong>Item encontrado:</strong> {foundCertificate.title || foundCertificate.name}</p>
                  <p><strong>ID:</strong> {foundCertificate.id}</p>
                  <p><strong>Slug:</strong> {foundCertificate.slug}</p>
                </div>
              )}
            </div>

            {Object.keys(manifest.certificados).length > 0 && (
              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-semibold text-foreground">Arquivos salvos</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {Object.entries(manifest.certificados).map(([key, value]) => (
                    <li key={key} className="rounded-lg border border-border bg-background/50 px-3 py-2">
                      <strong className="text-foreground">{value.id || key}</strong> • {value.name || value.title || key} • {value.institution || "Arquivo"} • {value.status || "Disponível"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">{status || "As alterações entram no site após o deploy do servidor."}</p>

          <button
            onClick={handleUpload}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar arquivos"}
          </button>
        </div>
      </div>
    </div>
  );
}
