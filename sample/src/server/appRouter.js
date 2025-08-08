// server/appRouter.ts
import { router } from "./trpc";
import { geminiRouter } from "./routers/gemini";

export const appRouter = router({
  gemini: geminiRouter,
});
