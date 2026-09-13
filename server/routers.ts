import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactMessage, updateContactMessageStatus } from "./db";
import { notifyOwner } from "./_core/notification";

const contactAttempts = new Map<string, number[]>();
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX_ATTEMPTS = 5;

function getClientIp(req: { ip?: string; socket: { remoteAddress?: string } }) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function isContactRateLimited(ip: string) {
  const now = Date.now();
  const recentAttempts = (contactAttempts.get(ip) || []).filter((attempt) => now - attempt < CONTACT_WINDOW_MS);

  if (recentAttempts.length >= CONTACT_MAX_ATTEMPTS) {
    contactAttempts.set(ip, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  contactAttempts.set(ip, recentAttempts);
  return false;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(1, "Nome é obrigatório").max(255),
          email: z.string().trim().email("Email inválido").max(320),
          message: z.string().trim().min(1, "Mensagem é obrigatória").max(5000),
          website: z.string().max(255).optional().default(""),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (input.website) {
          return {
            success: true,
            message: "Mensagem enviada com sucesso! Obrigado por entrar em contato.",
          };
        }

        const origin = ctx.req.headers.origin;
        const host = ctx.req.headers.host;
        if (origin && host) {
          try {
            if (new URL(origin).host !== host) {
              return { success: false, message: "Não foi possível validar a origem da solicitação." };
            }
          } catch {
            return { success: false, message: "Não foi possível validar a origem da solicitação." };
          }
        }

        if (isContactRateLimited(getClientIp(ctx.req))) {
          return { success: false, message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
        }

        try {
          // Save message to database
          const result = await createContactMessage({
            name: input.name,
            email: input.email,
            message: input.message,
            status: "pending",
          });

          // Send notification to owner
          const messageId = (result as any).insertId || 0;
          await notifyOwner({
            title: `Nova mensagem de contato de ${input.name}`,
            content: `Email: ${input.email}\n\nMensagem:\n${input.message}`,
          });

          // Update status to sent
          if (messageId) {
            await updateContactMessageStatus(messageId, "sent");
          }

          return {
            success: true,
            message: "Mensagem enviada com sucesso! Obrigado por entrar em contato.",
          };
        } catch (error) {
          console.error("[Contact] Failed to send message:", error);
          return {
            success: false,
            message: "Erro ao enviar mensagem. Tente novamente mais tarde.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
