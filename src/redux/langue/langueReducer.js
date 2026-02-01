const initialState = {
  currentLanguage: localStorage.getItem("language") || "en",
  availableLanguages: ["en", "fr", "de"],
};

const SET_LANGUAGE = "SET_LANGUAGE";

export const setLanguage = (language) => {
  localStorage.setItem("language", language);
  return {
    type: SET_LANGUAGE,
    payload: language,
  };
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
      };
    default:
      return state;
  }
};

export default languageReducer;
