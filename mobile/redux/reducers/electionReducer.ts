import { Action, ActionType, TCurrentElection } from "../../types";
import * as SecureStore from "expo-secure-store";

const initialState: TCurrentElection | null = null;

async function storeElectionId(id: number | null) {
  await SecureStore.setItemAsync("eid", id + "");
}

function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SET_CURRENT_ELECTION:
      return action.payload;
    default:
      return state;
  }
}

export default reducer;
