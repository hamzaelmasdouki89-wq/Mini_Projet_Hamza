export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFail = (message) => ({
  type: "LOGIN_FAIL",
  payload: message,
});

export const logout = () => ({
  type: "LOGOUT",
});

export const changeColor = (color) => ({
  type: "CHANGE_COLOR",
  payload: color,
});
