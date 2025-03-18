import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: z.Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            const error = err as Error;

            if (error instanceof z.ZodError || error.name === 'ZodError') {
                res.status(422).json({
                    message: "Validation failed",
                    errors: (error as z.ZodError).issues.map(issue => ({
                        message: issue.message,
                        path: issue.path
                    }))
                });
                return;
            }

            // Handle errors thrown inside refine callbacks
            res.status(422).json({
                message: "Validation failed",
                errors: [{ message: error.message, path: [] }]
            });
            return;
        }
    };
};