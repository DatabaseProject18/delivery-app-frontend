import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3005/api/",
  timeout: 10000,
  headers: { "scms-auth-token": localStorage.getItem("scms-auth-token") },
});

const createResult = async (promise) => {
  let result;
  try {
    result = await promise;
    console.log(result);
  } catch (error) {
    result = error.response;
    if (
      result.error &&
      (result.error.single === "Authorization token is not provided" ||
        result.error.single === "Authorization token is invalid")
    ) {
      const res = await instance.post("renewAccessToken", {
        refreshToken: localStorage.getItem("scms-refresh-token"),
      });
      if (res.status === 200) {
        localStorage.setItem("scms-auth-token", res.data.single);
        if (error.response.config.method === "get") {
          return await createResult(
            instance[error.response.config.method](error.response.config.url)
          );
        } else {
          return await createResult(
            instance[error.response.config.method](
              error.response.config.url,
              JSON.parse(error.response.config.data)
            )
          );
        }
      } else {
        localStorage.removeItem("scms-auth-token");
        localStorage.removeItem("scms-refresh-token");
        window.location = "/login";
      }
    }
  }
  return new Promise((resolve) => {
    resolve({
      resCode: result.status,
      result: result.data,
    });
  });
};

export const api = {
  auth: {
    register: async (data) => {
      return await createResult(instance.post("login", data));
    },
    logout: async (data) => {
      return await createResult(instance.post("logout", data));
    },
  },
  customer: {
    getCustomerTypes: async () => {
      return await createResult(instance.get("customer/types"));
    },
  },
};
