import { Router, Application, RequestHandler } from "express";
import { didIVote, placeVote } from "../controllers/VoteController";

import { authToken } from "../middleware/AuthMiddleware";

/**
 * This class contains API routes for the User Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/UserController.ts; ../entities/User.ts; ../middleware/AuthMiddleware;
 * @since 0.0.1
 */

const router = Router();

router.post("/election", authToken as RequestHandler, placeVote as Application);
router.get("/election", authToken as RequestHandler, didIVote as Application);

export default router;
