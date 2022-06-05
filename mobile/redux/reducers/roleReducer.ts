import { Action, ActionType, SetRoleAction, TRole } from "../../types";

const initialState: TRole | null = null;

function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SET_ROLE:
      return action.payload;
    default:
      return state;
  }
}

export default reducer;
