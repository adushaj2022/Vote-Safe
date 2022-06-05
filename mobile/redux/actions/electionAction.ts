import { Dispatch } from "redux";
import { Action, ActionType, TCurrentElection } from "../../types";

export const SetCurrentElection = (value: TCurrentElection | null) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_CURRENT_ELECTION,
      payload: value,
    });
  };
};
