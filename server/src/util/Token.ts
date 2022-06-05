import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv-safe";
dotenv.config({
  allowEmptyValues: true,
  example: "./.env",
});

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "72h",
  });
};
