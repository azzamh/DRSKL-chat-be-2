import express from "express";
import { validate } from "@src/shared/middleware/validate";
import * as Validation from "./validation";
import * as Handler from "./user.handler";
import { verifyJWT } from '@src/shared/middleware/verifyJWT';

const router = express.Router();

router.post("/register", validate(Validation.registerSchema), Handler.registerHandler);
router.post("/login", validate(Validation.loginSchema), Handler.loginHandler);
router.post("/verify-token", validate(Validation.verifyTokenSchema), Handler.verifyTokenHandler);
router.get("/info", verifyJWT, Handler.getUserInfo);
router.get("/info/:username", verifyJWT, validate(Validation.getUserInfoSchema), Handler.getUserInfoByUserName);

export default router;

