import { z } from "zod";

export const addOrUpdateUser = z.object({
  body: z.object({
    id: z.string(),
    username: z.string(),
    fullname: z.string(),
  })
});
