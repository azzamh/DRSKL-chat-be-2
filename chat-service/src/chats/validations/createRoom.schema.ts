import { z } from "zod";

export const createRoom = z.object({
  body: z.object({
    room_id: z.string(),
    name: z.string(),
  })
});
