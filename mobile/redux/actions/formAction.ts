import { Dispatch } from "redux";
import { Action, ActionType, TRegisterForm } from "../../types";

export const SetFormInfo = (obj: TRegisterForm) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_FORM,
      payload: obj,
    });
  };
};

export const ClearFormInfo = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CLEAR_FORM,
      payload: undefined,
    });
  };
};
