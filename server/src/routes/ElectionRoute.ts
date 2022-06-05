import { Router, Application, RequestHandler } from "express";
import {
  electionResults,
  electionStatus,
  getElectionById,
  newElection,
  userGetElections,
  userRegisteredInElections,
} from "../controllers/ElectionController";
import { authToken } from "../middleware/AuthMiddleware";

/**
 * This class contains API route for the Election Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/ElectionController.ts; ../entities/Election.ts; ../middleware/AuthMiddleware;
 * @since 0.0.1
 */

const router = Router();
router.post("/", authToken as RequestHandler, newElection as Application);
router.get("/", authToken as RequestHandler, getElectionById as Application);
router.get(
  "/status",
  authToken as RequestHandler,
  electionStatus as Application
);
router.get(
  "/user",
  authToken as RequestHandler,
  userGetElections as Application
);
router.get(
  "/registered",
  authToken as RequestHandler,
  userRegisteredInElections as Application
);

router.get(
  "/results",
  authToken as RequestHandler,
  electionResults as Application
);

export default router;
