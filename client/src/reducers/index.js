import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import patternReducer from "./patternReducer";
import projectReducer from "./projectReducer";
import tacticReducer from "./tacticReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  pattern: patternReducer,
  project: projectReducer,
  tactic: tacticReducer
});
