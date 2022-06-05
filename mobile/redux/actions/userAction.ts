import { Dispatch } from "redux";
import { Action, ActionType, STUser, TRegisterForm } from "../../types";

export const LoginUser = (user: STUser) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.LOGIN,
      payload: user,
    });
  };
};

export const LogoutUser = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.LOGOUT,
      payload: undefined,
    });
  };
};
