import { z } from "zod";

export const getTypingStatus = z.object({
  params: z.object({
    username: z.string().min(1)
  }),
});
