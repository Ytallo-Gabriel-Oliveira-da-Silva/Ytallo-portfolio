import "dotenv/config";
import crypto from "crypto";
import express from "express";
import { createServer } from "http";
import fs from "fs";
import net from "net";
import multer from "multer";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { buildCertificateSlug, normalizeManifest, lookupCertificateByIdOrSlug } from "./manifest";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_UPLOAD_PASSWORD_HASH ||
  "275f5a0985917445c864aac1fc467bcd97ba2ae0f9bf540d0327792a89d1b215b1297e37e6e509b46854b10487c3fae1c2b14bc4129402a150df2c660b9a3c4b";
const ADMIN_PASSWORD_SALT = process.env.ADMIN_UPLOAD_PASSWORD_SALT || "ytallo-portal-admin-v1";
const ADMIN_PASSWORD_ITERATIONS = Number(process.env.ADMIN_UPLOAD_PASSWORD_ITERATIONS || "200000");

function verifyAdminPassword(input: string) {
  if (!input) return false;

  const candidateHash = crypto
    .pbkdf2Sync(input, ADMIN_PASSWORD_SALT, ADMIN_PASSWORD_ITERATIONS, 64, "sha512")
    .toString("hex");

  const expectedHashBuffer = Buffer.from(ADMIN_PASSWORD_HASH, "hex");
  const candidateHashBuffer = Buffer.from(candidateHash, "hex");

  if (expectedHashBuffer.length !== candidateHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedHashBuffer, candidateHashBuffer);
}

function ensureUploadDirectories() {
  fs.mkdirSync(path.join(uploadRoot, "curriculos"), { recursive: true });
  fs.mkdirSync(path.join(uploadRoot, "certificados"), { recursive: true });
}

function readManifest() {
  const manifestPath = path.join(uploadRoot, "manifest.json");
  try {
    return normalizeManifest(JSON.parse(fs.readFileSync(manifestPath, "utf8")));
  } catch {
    return normalizeManifest({ curriculos: { pt: null, en: null }, certificados: {} });
  }
}

function saveManifest(manifest: any) {
  const manifestPath = path.join(uploadRoot, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function requireAdminAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.query.token || "";

  if (!verifyAdminPassword(token)) {
    return res.status(401).json({ message: "Acesso não autorizado." });
  }

  next();
}

const fileStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === "curriculoPt" || file.fieldname === "curriculoEn") {
      cb(null, path.join(uploadRoot, "curriculos"));
      return;
    }
    cb(null, path.join(uploadRoot, "certificados"));
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "curriculoPt") {
      cb(null, "curriculo-pt.pdf");
      return;
    }
    if (file.fieldname === "curriculoEn") {
      cb(null, "curriculo-en.pdf");
      return;
    }

    const safeKey = (req.body.certificadoSlug || req.body.certificadoKey || file.originalname.replace(/\.[^/.]+$/, ""))
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "certificado";

    cb(null, `${safeKey}-${Date.now()}.pdf`);
  },
});

const upload = multer({
  storage: fileStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/octet-stream"];
    if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
      return;
    }
    cb(new Error("Apenas arquivos PDF são permitidos."));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  ensureUploadDirectories();

  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use("/uploads", express.static(uploadRoot));

  app.get("/api/public/manifest", (_req, res) => {
    res.json(readManifest());
  });

  app.get("/api/admin/manifest", requireAdminAuth, (_req, res) => {
    res.json(readManifest());
  });

  app.get("/api/admin/certificado", requireAdminAuth, (req, res) => {
    const query = String(req.query.q || "").trim();
    const manifest = readManifest();

    if (!query) {
      res.json({ success: true, item: null, items: Object.values(manifest.certificados) });
      return;
    }

    const items = Object.values(manifest.certificados ?? {});
    const filtered = items.filter((item: any) => {
      const values = [item.id, item.slug, item.name, item.title, item.institution, item.status];
      return values.some((value) => String(value || "").toLowerCase().includes(query.toLowerCase()));
    });

    const result = filtered[0] || lookupCertificateByIdOrSlug(manifest, query);
    res.json({ success: true, item: result || null, items: filtered });
  });

  app.post(
    "/api/admin/upload",
    requireAdminAuth,
    upload.fields([
      { name: "curriculoPt", maxCount: 1 },
      { name: "curriculoEn", maxCount: 1 },
      { name: "certificadoArquivo", maxCount: 1 },
    ]),
    (req, res) => {
      const manifest = readManifest();

      if (req.files && "curriculoPt" in req.files && req.files.curriculoPt?.[0]) {
        const file = req.files.curriculoPt[0];
        manifest.curriculos.pt = {
          name: file.originalname,
          type: file.mimetype || "application/pdf",
          size: file.size,
          url: "/uploads/curriculos/curriculo-pt.pdf",
          uploadedAt: new Date().toISOString(),
        };
      }

      if (req.files && "curriculoEn" in req.files && req.files.curriculoEn?.[0]) {
        const file = req.files.curriculoEn[0];
        manifest.curriculos.en = {
          name: file.originalname,
          type: file.mimetype || "application/pdf",
          size: file.size,
          url: "/uploads/curriculos/curriculo-en.pdf",
          uploadedAt: new Date().toISOString(),
        };
      }

      if (req.files && "certificadoArquivo" in req.files && req.files.certificadoArquivo?.[0]) {
        const file = req.files.certificadoArquivo[0];
        const id = String(req.body.certificadoId || req.body.id || `cert-${Date.now()}`).trim() || `cert-${Date.now()}`;
        const name = String(req.body.certificadoName || req.body.name || file.originalname).trim() || file.originalname || "Certificado";
        const title = String(req.body.certificadoTitle || req.body.title || name).trim() || name;
        const institution = String(req.body.certificadoInstitution || req.body.institution || "Arquivo enviado via painel admin").trim();
        const status = String(req.body.certificadoStatus || req.body.status || "Disponível").trim();
        const slug = String(req.body.certificadoSlug || buildCertificateSlug(title || file.originalname)).trim();

        manifest.certificados[id] = {
          id,
          slug,
          name,
          title,
          institution: institution || "Arquivo enviado via painel admin",
          status: status || "Disponível",
          type: file.mimetype || "application/pdf",
          size: file.size,
          url: `/uploads/certificados/${path.basename(file.path)}`,
          hasImage: Boolean(req.body.certificadoHasImage === "true" || req.body.hasImage === "true"),
          uploadedAt: new Date().toISOString(),
        };
      }

      saveManifest(manifest);
      res.json({ success: true, message: "Arquivo enviado com sucesso." });
    }
  );

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
