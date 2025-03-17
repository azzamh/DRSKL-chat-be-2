import { z } from "zod";

export const setOnlineStatus = z.object({
  body: z.object({
    // username: z.string(),
    is_online: z.boolean(),
  })
});
