import isEmpty from "../validation/is-empty";

import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  isDataProtectionOfficer: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      if (action.payload.role == "Data Protection Officer") {
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
          isDataProtectionOfficer: true
        };
      } else {
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
          isDataProtectionOfficer: false
        };
      }

    default:
      return state;
  }
}
