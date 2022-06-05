import { Action, ActionType, TRegisterForm } from "../../types";

const initialState: TRegisterForm | null = {
  firstName: "",
  lastName: "",
  address: "",
  country: "",
  dateOfBirth: "",
  state: "",
  city: "",
  username: "",
  password: "",
  phoneNumber: "",
};

function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SET_FORM:
      return { ...action.payload };

    case ActionType.CLEAR_FORM:
      return initialState;

    default:
      return state;
  }
}

export default reducer;
