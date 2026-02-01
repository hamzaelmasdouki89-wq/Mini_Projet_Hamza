const getInitialState = () => {
  try {
    const savedAuth = localStorage.getItem("authState");
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      console.log("Auth state restored from localStorage:", parsed);
      return parsed;
    }
  } catch (err) {
    console.error("Error reading from localStorage:", err);
  }

  return {
    user: null,
    isAuthenticated: false,
    loginAttempts: 0,
    error: null,
  };
};

const initialState = getInitialState();

export const authReducer = (state = initialState, action) => {
  let newState = state;

  switch (action.type) {
    case "LOGIN_SUCCESS":
      newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loginAttempts: 0,
        error: null,
      };
      break;

    case "LOGIN_FAIL":
      newState = {
        ...state,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1,
      };
      break;

    case "LOGOUT":
      localStorage.removeItem("authState");
      console.log("Logged out - localStorage cleared");
      return {
        user: null,
        isAuthenticated: false,
        loginAttempts: 0,
        error: null,
      };

    case "UPDATE_USER_COLOR":
      newState = {
        ...state,
        user: {
          ...state.user,
          couleur: action.payload,
        },
        isAuthenticated: true,
      };
      break;

    case "CHANGE_COLOR":
      newState = {
        ...state,
        user: {
          ...state.user,
          couleur: action.payload,
        },
        isAuthenticated: true,
      };
      break;

    default:
      return state;
  }

  if (action.type !== "LOGOUT") {
    try {
      localStorage.setItem("authState", JSON.stringify(newState));
      console.log("Auth state saved to localStorage:", newState);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }

  return newState;
};

export default authReducer;
