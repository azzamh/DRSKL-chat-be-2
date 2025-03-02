import { z } from "zod";

export const getLastSeen = z.object({
  params: z.object({
    username: z.string().min(1)
  }),
});
