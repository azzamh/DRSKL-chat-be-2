import { z } from "zod";

export const startPrivateConversation = z.object({
    body: z.object({
        peer_username: z.string(),
    })
})