// server/routers/gemini.js
import { publicProcedure, router } from "../trpc";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";

export const geminiRouter = router({
  insertMessage: publicProcedure
    .input(z.object({
      text: z.string(),
      sender: z.string(),
      user_id: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { text, sender, user_id } = input;

      const { data, error } = await supabase.from("messages").insert([
        { text, sender, user_id },
      ]);

      if (error) throw new Error(error.message);
      return data;
    }),
});
