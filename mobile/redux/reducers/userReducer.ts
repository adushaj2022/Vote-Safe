import { Action, ActionType, STUser } from "../../types";
import * as SecureStore from "expo-secure-store";

let initialState: STUser | null = null;

const reducer = (state: STUser | null = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      (async () => {
        let jwt = action.payload?.jwtToken;
        if (jwt) {
          await SecureStore.setItemAsync("jwtToken", jwt);
        }
      })();

      return action.payload;

    case ActionType.LOGOUT:
      (async () => {
        await SecureStore.deleteItemAsync("jwtToken");
      })();
      return null;

    default:
      return state;
  }
};

export default reducer;
