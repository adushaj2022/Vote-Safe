import { Router, Application, RequestHandler } from "express";
import {
  acceptInvite,
  inviteUser,
  isUserInvited,
  rejectInvite,
  sendInviteByUrl,
  viewUserInvites,
} from "../controllers/InviteController";

import { authToken } from "../middleware/AuthMiddleware";

/**
 * This class contains the Invite Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/InviteController.ts; ../routes/InviteRoute.ts; ../middleware/AuthMiddleware;
 * @since 0.0.1
 */

const router = Router();
router.post("/", authToken as RequestHandler, <Application>inviteUser);
router.get("/", authToken as RequestHandler, <Application>viewUserInvites);
router.post("/accept", authToken as RequestHandler, <Application>acceptInvite);
router.post("/reject", authToken as RequestHandler, <Application>rejectInvite);
router.get("/exists", authToken as RequestHandler, <Application>isUserInvited);
router.post("/url", authToken as RequestHandler, <Application>sendInviteByUrl);

export default router;
