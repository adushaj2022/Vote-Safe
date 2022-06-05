import { combineReducers } from "redux";
import formReducer from "./formReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import electionReducer from "./electionReducer";

const reducers = combineReducers({
  registerForm: formReducer,
  user: userReducer,
  role: roleReducer,
  currentElection: electionReducer,
});

export default reducers;
export type State = ReturnType<typeof reducers>;
