import { z } from "zod";
import { paginationSchema } from "@src/shared/validations/pagination.schema";

export const getRoomMessages = z.object({
  params: z.object({
    room_id: z.string().min(1)
  }),
  ...paginationSchema
});
