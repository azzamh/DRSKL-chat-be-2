import { z } from "zod";

export const joinRoom = z.object({
  params: z.object({
    room_id: z.string()
  })
});
