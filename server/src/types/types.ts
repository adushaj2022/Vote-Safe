import { Request } from "express";
import { Session } from "express-session";

/*
    We are using typescript, so we make our own custom
    request type by extending it and adding a session type with extra variables
    We cannot just do req.session.foo = 'bar', if we want to do that we need to add a
    foo property below, along side phone number
*/

// REFERENCE: https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata

export interface userInfo {
  id: number;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: userInfo;
}

export interface RegisterRecord {
  userId: string | number;
  electionId: string | number;
}

export type SessionWithUser = Session & {
  phoneNumber: string | {};
  userId: number | {};
  electionId: number | {};
  sid: string | {};
};

export type AuthRequest = IGetUserAuthInfoRequest & {
  session?: SessionWithUser;
};
