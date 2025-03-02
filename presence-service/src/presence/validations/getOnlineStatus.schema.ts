import { z } from "zod";

export const getOnlineStatus = z.object({
  params: z.object({
    username: z.string().min(1)
  }),
});
