const initialState = {
  requests: [],
};

function requestReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_REQUESTS":
      return {
        ...state,
        requests: action.payload,
      };

    case "ADD_REQUEST":
      return {
        ...state,
        requests: [...state.requests, action.payload],
      };

    case "UPDATE_REQUEST_STATUS":
      return {
        ...state,
        requests: state.requests.map((req) =>
          req.id === action.payload.id
            ? { ...req, status: action.payload.status }
            : req,
        ),
      };

    case "DELETE_REQUEST":
      return {
        ...state,
        requests: state.requests.filter((req) => req.id !== action.payload),
      };

    default:
      return state;
  }
}

export default requestReducer;
