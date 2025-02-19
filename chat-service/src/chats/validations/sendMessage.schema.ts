import { z } from "zod";

export const sendMessage = z.object({
    body: z.object({
      conversation_id: z.number(),
      message: z.string(),
    })
})