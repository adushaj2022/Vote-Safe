import { Application, Router } from "express";
import { sendVerificationCode, verifyCode } from "../controllers/SmsController";

/** 
  * This class contains API route for the Sms Verification. 
  * 
  * @author Anthony Dushaj <https://github.com/adushaj2022> 
  * @see ../controllers/SmsController.ts;
  * @since 0.0.1 
  */ 

const router = Router();
router.post("/send-code", sendVerificationCode as Application);
router.post("/verify-code", verifyCode as Application);

export default router;
