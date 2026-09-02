import { describe, expect, it } from "vitest";
import { buildCertificateSlug, lookupCertificateByIdOrSlug, normalizeManifest } from "./manifest";

describe("manifest helpers", () => {
  it("gerencia slug em minúsculas e com traço", () => {
    expect(buildCertificateSlug("Certificado de UX & React")).toBe("certificado-de-ux-react");
  });

  it("normaliza manifest com ids e itens em lista", () => {
    const manifest = normalizeManifest({
      curriculos: { pt: null, en: null },
      certificados: {
        "certificado-de-ux": {
          id: "cert-001",
          name: "Certificado de UX",
          title: "Certificado de UX",
          institution: "Alura",
          status: "Ativo",
          slug: "certificado-de-ux",
          url: "/uploads/certificados/certificado-de-ux.pdf",
          hasImage: false,
        },
      },
    });

    expect(Object.keys(manifest.certificados)).toContain("cert-001");
    expect(manifest.certificados["cert-001"]).toMatchObject({
      id: "cert-001",
      title: "Certificado de UX",
      institution: "Alura",
      status: "Ativo",
      slug: "certificado-de-ux",
      url: "/uploads/certificados/certificado-de-ux.pdf",
      hasImage: false,
    });
  });

  it("localiza por id, slug ou numero mesmo com formato variado", () => {
    const manifest = normalizeManifest({
      curriculos: { pt: null, en: null },
      certificados: {
        "certificado-de-ux": {
          id: "cert-001",
          name: "Certificado de UX",
          title: "Certificado de UX",
          institution: "Alura",
          status: "Ativo",
          slug: "certificado-de-ux",
          url: "/uploads/certificados/certificado-de-ux.pdf",
          hasImage: false,
        },
      },
    });

    expect(lookupCertificateByIdOrSlug(manifest, "cert001")).toMatchObject({ id: "cert-001" });
    expect(lookupCertificateByIdOrSlug(manifest, "001")).toMatchObject({ id: "cert-001" });
  });
});
