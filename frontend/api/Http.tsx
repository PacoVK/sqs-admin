import { ApiCall } from "../types";

const callApi = async (apiCall: ApiCall) => {
  const baseUrl = import.meta.env.DEV ? "http://localhost:3999/" : "";
  fetch(`${baseUrl}sqs`, {
    method: apiCall.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: apiCall.queue
      ? JSON.stringify({
          action: apiCall.action,
          queue: apiCall.queue,
          message: apiCall.message ? apiCall.message : "",
        })
      : null,
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      apiCall.onSuccess(data);
    })
    .catch((error) => {
      apiCall.onError(error.message);
    });
};

export { callApi };
