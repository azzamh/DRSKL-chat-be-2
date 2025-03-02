import { z } from "zod";

export const setTypingStatus = z.object({
  body: z.object({
    // username: z.string(),
    is_typing: z.boolean(),
  })
});
