import { z } from "zod";

export const setOnlineStatus = z.object({
  body: z.object({
    // username: z.string(),
    isOnline: z.boolean(),
  })
});
