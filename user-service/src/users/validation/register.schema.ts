import { z } from 'zod'

export const registerSchema = z.object({
    body: z.object({
        username: z.string(),
        // email: z.string().email(),
        password: z.string().min(8).refine((password) => {
            const regex = [
                {
                    regex: /[a-z]/,
                    errorMessage: 'Password must contain at least one lowercase letter',
                },
                {
                    regex: /[A-Z]/,
                    errorMessage: 'Password must contain at least one uppercase letter',
                },
                {
                    regex: /\d/,
                    errorMessage: 'Password must contain at least one number',
                },
            ]

            // Return false if any regex test fails
            for (const reg of regex) {
                if (!reg.regex.test(password)) {
                    return false;
                }
            }
            return true;
        }, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
        full_name: z.string(),
    })
})