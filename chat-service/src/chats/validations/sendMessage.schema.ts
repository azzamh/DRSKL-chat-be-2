import { z } from "zod";

export const sendMessage = z.object({
    body: z.object({
      room_id: z.string(),
      message: z.string(),
    })
})