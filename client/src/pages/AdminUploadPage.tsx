import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, FileImage, FileUp, Lock, ShieldCheck, UploadCloud } from "lucide-react";

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

const CERTIFICATE_LIBRARY = [
  { id: "cert-001", name: "Imersão Front-End", slug: "imersao-front-end-alura", institution: "ALURA", status: "Concluído" },
  { id: "cert-002", name: "Imersão Front-End 2ª Edição", slug: "imersao-front-end-2-edicao-alura", institution: "ALURA", status: "Concluído" },
  { id: "cert-003", name: "React DEV", slug: "react-dev-alura", institution: "ALURA", status: "Concluído" },
  { id: "cert-004", name: "Imersão DEV com Google Gemini", slug: "imersao-dev-google-gemini", institution: "ALURA + GOOGLE", status: "Concluído" },
  { id: "cert-005", name: "HTML e CSS: Ambientes de Desenvolvimento", slug: "html-css-ambientes-desenvolvimento", institution: "ALURA", status: "Concluído" },
  { id: "cert-006", name: "Dados com Python", slug: "dados-com-python", institution: "ALURA", status: "Concluído" },
  { id: "cert-007", name: "Solve for Tomorrow", slug: "solve-for-tomorrow", institution: "Samsung", status: "Concluído" },
  { id: "cert-008", name: "Empreendedorismo", slug: "empreendedorismo-ja-pernambuco", institution: "JA Pernambuco Mini Empresa", status: "Concluído" },
  { id: "cert-009", name: "Cyber Segurança", slug: "cyber-seguranca-dio-riachuelo", institution: "DIO + Riachuelo", status: "Em andamento" },
  { id: "cert-010", name: "Letramento Digital", slug: "letramento-digital-senai", institution: "SENAI", status: "Concluído" },
  { id: "cert-011", name: "8ª ONDA", slug: "onda-8", institution: "ONDA", status: "Concluído" },
  { id: "cert-012", name: "18ª Mostra Brasileira de Foguetes", slug: "mostra-brasileira-foguetes", institution: "MOBFOG + OBA", status: "Concluído" },
  { id: "cert-013", name: "Olimpíada Brasileira de Astronomia e Astronáutica", slug: "olimpiada-astronomia-astronautica", institution: "S.A.B + OBA", status: "Concluído" },
  { id: "cert-014", name: "Monitoria Voluntária Bolsista - Robótica e Física", slug: "monitoria-robotica-fisica", institution: "ETE Ginásio Pernambucano", status: "Concluído" },
  { id: "cert-015", name: "WEB3 Week 6ª Edição", slug: "web3-week-6-edicao", institution: "Luiz Tools", status: "Concluído" },
] as const;

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

const normalizeSearchValue = (value: string | undefined | null) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

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
  const [certificateHasImage, setCertificateHasImage] = useState(true);
  const [selectedFile, setSelectedFile] = useState<UploadMeta | null>(null);
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);

  const manifestEntries = useMemo(() => Object.values(manifest.certificados), [manifest.certificados]);

  const applyCertificateForm = (item: Partial<CertificateItem> | null) => {
    if (!item) return;

    setSelectedCertificateId(item.id || null);
    setCertificateId(item.id || "");
    setCertificateName(item.name || item.title || "");
    setCertificateSlug(item.slug || "");
    setCertificateInstitution(item.institution || "");
    setCertificateStatus(item.status || "Disponível");
    setCertificateHasImage(Boolean(item.hasImage ?? true));
  };

  const selectLibraryItem = (entry: (typeof CERTIFICATE_LIBRARY)[number]) => {
    const item = manifestEntries.find((found) => found.id === entry.id || found.slug === entry.slug) || {
      ...entry,
      name: entry.name,
      title: entry.name,
      institution: entry.institution,
      status: entry.status,
      hasImage: true,
      type: "image/jpeg",
      size: 0,
    };

    applyCertificateForm(item);
    setSearchQuery(entry.name);
    setStatus(`Item selecionado: ${entry.name}`);
  };

  useEffect(() => {
    if (!isUnlocked) return;

    fetch("/api/admin/manifest", {
      headers: { Authorization: `Bearer ${token}` },
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

    if (key === "curriculoPt") {
      setManifest((current) => ({ ...current, curriculos: { ...current.curriculos, pt: { name: file.name, size: file.size, type: file.type || "application/pdf" } } }));
      return;
    }

    if (key === "curriculoEn") {
      setManifest((current) => ({ ...current, curriculos: { ...current.curriculos, en: { name: file.name, size: file.size, type: file.type || "application/pdf" } } }));
      return;
    }

    if (key === "certificadoArquivo") {
      setSelectedFile({ name: file.name, size: file.size, type: file.type || "image/jpeg" });
      setCertificateHasImage(true);
    }
  };

  const handleCertificateSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setStatus("Digite um ID, slug ou nome para procurar.");
      return;
    }

    const matchOnLibrary = CERTIFICATE_LIBRARY.find((entry) => {
      const values = [entry.id, entry.slug, entry.name, entry.institution, entry.status];
      return values.some((value) => normalizeSearchValue(value).includes(normalizeSearchValue(query)) || normalizeSearchValue(query).includes(normalizeSearchValue(value)));
    });

    if (matchOnLibrary) {
      selectLibraryItem(matchOnLibrary);
      return;
    }

    try {
      const response = await fetch(`/api/admin/certificado?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setStatus("Sessão inválida ou acesso negado. Verifique a chave da área restrita.");
        return;
      }

      const result = await response.json();
      const item = result?.item ?? result?.items?.[0] ?? null;

      if (!item) {
        setStatus(`Nenhum certificado encontrado para: "${query}".`);
        setSelectedCertificateId(null);
        return;
      }

      applyCertificateForm(item);
      setStatus("Item localizado com sucesso. Você pode editar ou trocar a imagem.");
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
    if (certInput?.files?.[0]) formData.append("certificadoArquivo", certInput.files[0]);

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

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Falha ao enviar arquivo");

      const result = await response.json();
      setStatus(result.message || "Arquivo salvo com sucesso.");
      setSelectedFile(null);
      setCertificateId("");
      setCertificateName("");
      setCertificateSlug("");
      setCertificateInstitution("");
      setCertificateStatus("Disponível");
      setCertificateHasImage(true);
      setSearchQuery("");
      setSelectedCertificateId(null);

      if (certInput) certInput.value = "";
      if (fileInput) fileInput.value = "";
      if (fileInputEn) fileInputEn.value = "";

      const refreshed = await fetch("/api/admin/manifest", { headers: { Authorization: `Bearer ${token}` } });
      const latest = await refreshed.json();
      setManifest(latest);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao enviar arquivo.");
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
            type="button"
            onClick={async () => {
              setIsCheckingAccess(true);
              setStatus("");

              try {
                const response = await fetch("/api/admin/manifest", {
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                  setStatus("Chave inválida. Verifique a senha e tente novamente.");
                  return;
                }

                setIsUnlocked(true);
              } catch (error) {
                setStatus(error instanceof Error ? error.message : "Não foi possível validar a chave.");
              } finally {
                setIsCheckingAccess(false);
              }
            }}
            disabled={isCheckingAccess || !token.trim()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            {isCheckingAccess ? "Validando..." : "Entrar na central"}
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
      <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-6 shadow-[0_0_30px_rgba(0,217,255,0.08)] md:p-8">
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
              { key: "curriculoPt", label: "Currículo — Português" },
              { key: "curriculoEn", label: "Currículo — Inglês" },
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

            <div className="mb-5 rounded-xl border border-border bg-card p-4">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Pesquisar por ID, slug ou nome"
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleCertificateSearch}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-auto rounded-xl border border-border bg-card p-3">
              {CERTIFICATE_LIBRARY.map((entry) => {
                const isSelected = selectedCertificateId === entry.id || selectedCertificateId === entry.slug;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => selectLibraryItem(entry)}
                    className={`block w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                      isSelected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{entry.id}</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{entry.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{entry.institution} • {entry.status}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <FileImage size={16} />
                <h3 className="text-base font-bold">Editar item selecionado</h3>
              </div>

              <div className="grid gap-3">
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
                  Slug
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
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="inline-flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={certificateHasImage}
                    onChange={(event) => setCertificateHasImage(event.target.checked)}
                  />
                  Este certificado usa imagem em destaque
                </label>
              </div>

              <label className="mt-4 mb-2 block text-sm font-medium text-foreground">Imagem do certificado</label>
              <input
                id="certificadoArquivo"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
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

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-background"
                >
                  Salvar item
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">{status || "As alterações entram no site após o deploy do servidor."}</p>
        </div>
      </div>
    </div>
  );
}
