export type ManifestCertificate = {
  id: string;
  slug: string;
  name: string;
  title: string;
  institution?: string;
  status?: string;
  url: string;
  type?: string;
  size?: number;
  hasImage?: boolean;
  uploadedAt?: string;
};

export type ManifestState = {
  curriculos: {
    pt: any | null;
    en: any | null;
  };
  certificados: Record<string, ManifestCertificate>;
};

export function buildCertificateSlug(value: string) {
  return String(value || "certificado")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "certificado";
}

export function normalizeManifest(rawManifest: any): ManifestState {
  const base: ManifestState = {
    curriculos: { pt: null, en: null },
    certificados: {},
  };

  if (!rawManifest || typeof rawManifest !== "object") {
    return base;
  }

  const manifest = { ...base, ...rawManifest };
  const curriculos = {
    pt: rawManifest?.curriculos?.pt ?? null,
    en: rawManifest?.curriculos?.en ?? null,
  };

  const certificateEntries = rawManifest?.certificados && typeof rawManifest.certificados === "object" ? rawManifest.certificados : {};
  const normalizedCertificates: Record<string, ManifestCertificate> = {};

  Object.entries(certificateEntries).forEach(([key, value]) => {
    if (!value || typeof value !== "object") return;

    const item = value as any;
    const id = String(item.id || key || `cert-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`);
    const title = String(item.title || item.name || key || "Certificado");
    const slug = String(item.slug || buildCertificateSlug(title));

    normalizedCertificates[id] = {
      id,
      slug,
      name: String(item.name || title),
      title,
      institution: item.institution || "Arquivo enviado via painel admin",
      status: item.status || "Disponível",
      url: String(item.url || item.fileUrl || "#"),
      type: item.type || "application/pdf",
      size: typeof item.size === "number" ? item.size : 0,
      hasImage: Boolean(item.hasImage),
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    };
  });

  return {
    ...manifest,
    curriculos,
    certificados: normalizedCertificates,
  };
}

export function lookupCertificateByIdOrSlug(manifest: any, query: string) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return null;

  const items = Object.values(normalizeManifest(manifest).certificados ?? {});
  return (
    items.find((item: any) => {
      const values = [item.id, item.slug, item.name, item.title, item.institution];
      return values.some((value) => String(value || "").toLowerCase().includes(normalized));
    }) ?? null
  );
}
