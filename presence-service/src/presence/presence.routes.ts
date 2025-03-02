import express from "express";
import { validate } from "@src/shared/middleware/validate";
import * as Validation from "./validations";
import * as Handler from "./presence.handler";
import { verifyJWT } from "@src/shared/middleware/verifyJWT";

const router = express.Router();

router.post("/presence/online", verifyJWT, validate(Validation.setOnlineStatus), Handler.setOnlineStatus);
router.post("/presence/typing", verifyJWT, validate(Validation.setTypingStatus), Handler.setTypingStatus);
router.get("/presence/online/:username", verifyJWT, validate(Validation.getOnlineStatus), Handler.getOnlineStatus);
router.get("/presence/typing/:username", verifyJWT, validate(Validation.getTypingStatus), Handler.getTypingStatus);
router.get("/presence/lastseen/:username", verifyJWT, validate(Validation.getLastSeen), Handler.getLastSeen);

export default router;

