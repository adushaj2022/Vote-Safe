import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import smsRouter from "./routes/SmsRoute";
import userRouter from "./routes/UserRoute";
import electionRouter from "./routes/ElectionRoute";
import candidateRouter from "./routes/CandidateRoute";
import inviteRouter from "./routes/InviteRoute";
import voteRouter from "./routes/VoteRoute";
import verifyRouter from "./routes/IdVerifyRoute";
import { User } from "./entities/User";
import { Vote } from "./entities/Vote";
import { Election } from "./entities/Election";
import { Candidate } from "./entities/Candidate";
import { Invite } from "./entities/Invite";
import path from "path";

let RedisStore = connectRedis(session);
let redisClient = redis.createClient();

const app = express();

const httpServer = createServer(app);
// socket io for real time events
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.set("socketio", io); // so we can use io in different folder/file
app.set("redis", redisClient);

io.on("connection", function (socket) {
  socket.emit("connection:sid", socket.id); // send sid back to client
});

const port = process.env.PORT || 4000;

// CORS is a network security thing, read more about this on google
app.use(cors());

// use redis as a session store, we will need to store some data in session for this project
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.REDIS_SECRET,
    resave: false,
  })
);

app.use("/static", express.static("public"));

// where we start our server, initiate our routes and such
const main = async () => {
  const db = await createConnection({
    type: "postgres",
    host: process.env.HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: "votesafe",
    entities: [User, Vote, Election, Candidate, Invite], //tables go here
    synchronize: true,
    logging: true,
  });

  if (db.isConnected) {
    console.log("Connected to db");
  } else {
    console.log("Problem occurred");
  }

  app.get("/", (_, res) => {
    res.send("Happy Hacking 🚀");
  });

  app.get("/docs", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../src/views/docs.html"));
  });

  app.use("/verify", verifyRouter); // dont need json parser for the webhook

  // JSON is the format to recieve and send data, lets tell express
  app.use(express.json());

  // routers work with controllers, controllers work with models
  app.use("/sms", smsRouter);
  app.use("/user", userRouter);
  app.use("/election", electionRouter);
  app.use("/candidate", candidateRouter);
  app.use("/invite", inviteRouter);
  app.use("/vote", voteRouter);

  // fire up server
  httpServer.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

main().catch((err) => console.log(err));
