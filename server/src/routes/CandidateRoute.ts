import { Router, Application, RequestHandler } from "express";
import {
  createCandidate,
  getElectionsCandidate,
} from "../controllers/CandidateController";
import { authToken } from "../middleware/AuthMiddleware";

/** 
  * This class contains API route for the Candidate Object. 
  * 
  * @author Anthony Dushaj <https://github.com/adushaj2022> 
  * @see ../controllers/CandidateController.ts; ../entities/Candidate.ts; ../middleware/AuthMiddleware;
  * @since 0.0.1 
  */ 

const router = Router();
router.post("/", authToken as RequestHandler, <Application>createCandidate);
router.get(
  "/",
  authToken as RequestHandler,
  <Application>getElectionsCandidate
);
export default router;
