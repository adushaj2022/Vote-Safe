/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  // unathorized
  Welcome: undefined;
  Login: undefined;
  EnterPhoneNumber: undefined;
  EnterCode: undefined;
  EnterUserInfo: undefined;
  EnterMoreInfo: undefined;
  EnterMoreInfoTwo: undefined;
  BeginVerify: undefined;
  CreateLogin: undefined;
  PickRole: undefined;
  ThankYou: undefined | { verOutcome: string };

  // authorized
  Admin: NavigatorScreenParams<AdminTabParamList> | undefined;
  Voter: NavigatorScreenParams<VoteTabParamList> | undefined;
  AddCandidate: undefined;
  FullScreenCandidate: TCandidate | undefined;
  InviteUserProfile: TInviteUserProfile | undefined;
  ManageInvites: undefined;
  VoterPickElection: undefined;
  VoteSuccessful: undefined;

  // Shared
  Modal: { webvViewUri?: string };
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AdminTabParamList = {
  Profile: undefined;
  AdminInvite: undefined;
  AdminVoteResults: undefined;
  Candidates: undefined;
  Election: undefined;
};

export type VoteTabParamList = {
  Profile: undefined;
  VoterInvite: undefined;
  VoterResults: undefined;
  PlaceVote: undefined;
  ViewCandidates: undefined;
};

export type AdminTabScreenProps<Screen extends keyof AdminTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AdminTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type VoterTabScreenProps<Screen extends keyof VoteTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<VoteTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export interface TInviteUserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  id: number;
}

export interface TVotePair {
  cid: string | number;
  category: string;
}

export interface TRegisterForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // we store as a string to format properly
  address: string;
  state: string;
  country: string;
  city: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export interface TProfile {
  firstName: string;
  lastName: string;
  username: string;
  address: string;
  state: string;
  country: string;
  dateOfBirth: string;
  phoneNumber: string;
  city: string;
}

export interface TElection {
  name: string;
  description: string;
  openDate: string;
  closeDate: string;
  id: number;
}

export interface TScore {
  count: number;
  name: string;
  color: string;
}

export type TRole = "voter" | "admin";

export type TCurrentElection = number;

export interface STUser {
  jwtToken: string;
  user: {
    username: string;
    phoneNumber: string;
    id: number;
  };
}

export interface TResultVote {
  name: string;
  color: string;
  votes: number;
  legendFontColor: string;
  legendFontSize: string;
}

export interface TCandidate {
  name: string;
  imgUrl: string;
  description: string;
  party?: string;
  id: number;
  category: string;
}

export interface TInvite {
  id: number;
  election: TElection;
  inviter: TInviteUserProfile;
}

export enum ActionType {
  SET_FORM = "SET_FORM",
  CLEAR_FORM = "CLEAR_FORM",
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
  SET_ROLE = "SET_ROLE",
  SET_CURRENT_ELECTION = "SET_CURRENT_ELECTION",
}

export interface SetCurrentElectionAction {
  type: ActionType.SET_CURRENT_ELECTION;
  payload: TCurrentElection | null;
}

export interface SetRoleAction {
  type: ActionType.SET_ROLE;
  payload: TRole | null;
}

export interface LoginUserAction {
  type: ActionType.LOGIN;
  payload: STUser;
}

export interface LogoutUserAction {
  type: ActionType.LOGOUT;
  payload: undefined;
}

export interface SetFormInfoAction {
  type: ActionType.SET_FORM;
  payload: TRegisterForm;
}

export interface ClearFormInfoAction {
  type: ActionType.CLEAR_FORM;
  payload: undefined;
}

export type Action =
  | SetFormInfoAction
  | ClearFormInfoAction
  | LoginUserAction
  | LogoutUserAction
  | SetCurrentElectionAction
  | SetRoleAction;
