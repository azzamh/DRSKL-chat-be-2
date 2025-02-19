import { z } from "zod";

export const getUserInfoSchema = z.object({
    params: z.object({
        username: z.string()
    })
});
