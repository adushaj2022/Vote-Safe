import { Router, Application, RequestHandler } from "express";
import {
  getRole,
  getUsers,
  loginUser,
  me,
  profile,
  registerUser,
  setRole,
} from "../controllers/UserController";
import { authToken } from "../middleware/AuthMiddleware";

/**
 * This class contains API routes for the User Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/UserController.ts; ../entities/User.ts; ../middleware/AuthMiddleware;
 * @since 0.0.1
 */

const router = Router();

router.post("/register", registerUser as Application);
router.post("/login", loginUser as Application);
router.get("/me", authToken as RequestHandler, me as Application);
router.get("/profile", authToken as RequestHandler, profile as Application);
router.post("/role", authToken as RequestHandler, setRole as Application);
router.get("/role", authToken as RequestHandler, getRole as Application);
router.get("/profiles", authToken as RequestHandler, getUsers as Application);

export default router;
