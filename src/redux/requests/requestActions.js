export const setRequests = (requests) => ({
  type: "SET_REQUESTS",
  payload: requests,
});

export const addRequest = (request) => ({
  type: "ADD_REQUEST",
  payload: request,
});

export const updateRequestStatus = (id, status) => ({
  type: "UPDATE_REQUEST_STATUS",
  payload: { id, status },
});

export const deleteRequest = (id) => ({
  type: "DELETE_REQUEST",
  payload: id,
});
