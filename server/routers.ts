import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactMessage, updateContactMessageStatus } from "./db";
import { notifyOwner } from "./_core/notification";

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
          name: z.string().min(1, "Nome é obrigatório").max(255),
          email: z.string().email("Email inválido"),
          message: z.string().min(1, "Mensagem é obrigatória"),
        })
      )
      .mutation(async ({ input }) => {
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
