import express from "express";
import { validate } from "@src/shared/middleware/validate";
import * as Validation from "./validations";
import * as Handler from "./chat.handler";
import { verifyJWT } from "@src/shared/middleware/verifyJWT";

const router = express.Router();

router.post("/room/create", verifyJWT, validate(Validation.createRoom), Handler.createRoom);
router.post("/room/:room_id/join", verifyJWT, validate(Validation.joinRoom), Handler.joinRoom);
router.get("/room/:room_id/participants",
  verifyJWT,
  validate(Validation.getRoomParticipants),
  Handler.getRoomParticipants
);
router.get("/room/:room_id/details",
  verifyJWT,
  validate(Validation.getRoomDetails),
  Handler.getRoomDetails
);
router.get("/room/list",
  verifyJWT,
  validate(Validation.getRoomList),
  Handler.getRoomList
);
router.get("/room/:room_id/messages",
  verifyJWT,
  validate(Validation.getRoomMessages),
  Handler.getRoomMessages
);
router.post("/message/send", verifyJWT, validate(Validation.sendMessage), Handler.sendMessage);
router.get("/message/:id", verifyJWT, Handler.getMessageById);
router.post("/user", validate(Validation.addOrUpdateUser), Handler.addOrUpdateUser);



export default router;

