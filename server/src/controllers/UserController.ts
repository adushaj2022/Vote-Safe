import { Response, Request } from "express";
import { AuthRequest } from "../types/types";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { generateToken } from "../util/Token";
import { RedisClient } from "redis";
import { passCheck, specialCharacters } from "../util/Validator";

/**
 * This class allows users to login and register with its API route.
 *
 * @author Anthony, Chris, Logan
 * @see ../entities/User.ts; ../routes/UserRoute.ts;
 * @since 0.0.1
 */

// Register user
export async function registerUser(req: AuthRequest, res: Response) {
  const password = req.body?.password;
  const username = req.body?.username;
  let hashedPassword = await bcrypt.hash(req.body.password, 10); // hash pw
  let user: User | null = null;

  if (username) {
    const exists = await User.findOne({
      where: { username: req.body.username },
    });
    if (exists) {
      return res.send({ error: "user with associated username already" });
    }

    if (username.length < 5) {
      return res.send({ error: "username must be at least 5 characters" });
    }
    if (username.includes(specialCharacters)) {
      return res.send({
        error: "username can not contain a special character",
      });
    }
    if (password.length < 8 || !passCheck(password)) {
      return res.send({
        error: `password must be at least 8 characters, contain 1 special character, and 1 capital letter`,
      });
    }
  }

  try {
    user = User.create(req.body as User);
    user.phoneNumber = user.phoneNumber;
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    return res.status(400).send({ error: "problem creating user" });
  }
  const jwtToken = generateToken(user!);

  res.status(201).send({
    jwtToken,
    user: {
      username: user.username,
      phoneNumber: user.phoneNumber,
      id: user.id,
    },
  });
}

export async function loginUser(req: AuthRequest, res: Response) {
  const password = req.body.password;
  const username = req.body.username;
  let user: User | undefined;
  try {
    user = await User.findOne({ where: { username } });
  } catch (error) {
    return res.send({ error: "problem logging in" });
  }

  if (!user) {
    return res.send({ error: "no user with associated username" });
  }

  const match = await bcrypt.compare(password, user!.password);

  if (!match) {
    return res.send({ error: "wrong credentials" });
  }

  const jwtToken = generateToken(user);
  res.status(200).send({
    jwtToken,
    user: {
      username: user.username,
      phoneNumber: user.phoneNumber,
      id: user.id,
    },
  });
}

/*
  This function simply returns information about a user, it needs a token in the header
*/
export async function me(req: AuthRequest, res: Response) {
  const currUser = await User.findOne(req.user.id); // we know there is a user already because they passed middleware
  res.send({
    jwtToken: req.headers["authorization"]?.split(" ")[1],
    user: {
      username: currUser!.username,
      phoneNumber: currUser!.phoneNumber,
      id: currUser!.id,
    },
  });
}

export async function profile(req: AuthRequest, res: Response) {
  const profile = await User.findOne(req.user.id);
  const result = { ...profile };
  delete result.password; // never send password to client
  res.send(result);
}

export function setRole(req: AuthRequest, res: Response) {
  const redisClient: RedisClient = req.app.get("redis");
  const { role } = req.body,
    id = String(req.user.id);
  redisClient.set(id, role);
  res.send(true);
}

export function getRole(req: AuthRequest, res: Response) {
  const redisClient: RedisClient = req.app.get("redis");
  const id = String(req.user.id);
  redisClient.get(id, (e, val) => {
    if (e) {
      return res.status(400).send({ error: "Something went wrong" });
    }
    res.send(val);
  });
}

// fetch all users
export async function getUsers(req: AuthRequest, res: Response) {
  const users = await User.find({
    select: ["firstName", "username", "lastName", "phoneNumber", "id"],
  });
  res.send({ users });
}
