import { z } from "zod";
import { paginationSchema } from "@src/shared/validations/pagination.schema";

export const getRoomList = z.object({
  ...paginationSchema
});
