import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth/authReducer";
import requestReducer from "./requests/requestReducer";
import languageReducer from "./langue/langueReducer";

const authRouter = combineReducers({
  auth: authReducer,
  requests: requestReducer,
  language: languageReducer,
});

export const store = createStore(authRouter);
