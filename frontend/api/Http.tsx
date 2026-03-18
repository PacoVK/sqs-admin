import { ApiCall } from "../types";

const callApi = async (apiCall: ApiCall) => {
  try {
    const baseUrl = import.meta.env.DEV ? "http://localhost:3999/" : "";
    const response = await fetch(`${baseUrl}sqs`, {
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
    });
    
    const data = await response.json();
    apiCall.onSuccess(data);
  } catch (error) {
    apiCall.onError((error as Error).message);
  }
};

export { callApi };
