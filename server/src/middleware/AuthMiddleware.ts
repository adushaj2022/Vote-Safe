import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv-safe";
import { AuthRequest, IGetUserAuthInfoRequest, userInfo } from "../types/types";

/**
 * This class Authenticates users using a secrey key / private token.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../types/types.ts;
 * @since 0.0.1
 */

export const authToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (typeof token !== "undefined") {
    jwt.verify(token, process.env.SECRET_KEY, (err: any) => {
      if (err) {
        return res.json({ message: "invalid token provided" }).status(403);
      } else {
        const { id } = jwt.verify(token, process.env.SECRET_KEY) as userInfo;
        req.user = { id };
        next();
      }
    });
  } else {
    return res.json({ error: "no token provided" }).status(403);
  }
};
