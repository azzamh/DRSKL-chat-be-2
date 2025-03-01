import { z } from "zod";

export const paginationSchema = {
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number)
      .refine(val => val <= 100, {
        message: 'Limit cannot exceed 100'
      })
      .optional(),
  })
};
