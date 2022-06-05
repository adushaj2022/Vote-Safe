import { Dispatch } from "redux";
import { Action, ActionType, TRole } from "../../types";

export const SetRole = (value: TRole | null) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_ROLE,
      payload: value,
    });
  };
};
