import express, { Router, Application, RequestHandler } from "express";
import {
  createSession,
  webhookHandler,
} from "../controllers/IdVerifyController";

//import { authToken } from "../middleware/AuthMiddleware";

/**
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @since 0.0.1
 */

const router = Router();
router.post("/session", express.json(), createSession as Application);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler as Application
);

export default router;
