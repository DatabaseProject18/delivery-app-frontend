import axios from "axios";
import querystring from "querystring";

const instance = axios.create({
  baseURL: "http://localhost:3005/api/",
  timeout: 40000,
});

const getInstance = () => {
  instance.defaults.headers.common["scms-auth-token"] = localStorage.getItem(
    "scms-auth-token"
  );
  return instance;
};

const createResult = async (promise) => {
  let result;
  try {
    result = await promise;
  } catch (error) {
    if (!error.response) {
      return new Promise((resolve) => {
        resolve({
          resCode: 500,
          result: { error: { single: "Server is not available" } },
        });
      });
    }
    result = error.response;
    if (
      result.error &&
      (result.error.single === "Authorization token is not provided" ||
        result.error.single === "Authorization token is invalid")
    ) {
      const res = await getInstance().post("renewAccessToken", {
        refreshToken: localStorage.getItem("scms-refresh-token"),
      });
      if (res.status === 200) {
        localStorage.setItem("scms-auth-token", res.data.single);
        if (error.response.config.method === "get") {
          return await createResult(
            getInstance()[error.response.config.method](
              error.response.config.url
            )
          );
        } else {
          return await createResult(
            getInstance()[error.response.config.method](
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
      return await createResult(getInstance().post("register", data));
    },
    login: async (data) => {
      return await createResult(getInstance().post("login", data));
    },
    logout: async (data) => {
      return await createResult(getInstance().post("logout", data));
    },
  },
  customer: {
    getCustomerTypes: async () => {
      return await createResult(getInstance().get("customer/types"));
    },
  },
  cart: {
    getCart: async (data) => {
      return await createResult(
        getInstance().get(`cart?${querystring.stringify(data)}`)
      );
    },
    setCartQuntity: async (data) => {
      return await createResult(getInstance().patch("cart/cartQuantity", data));
    },
    productDeleteFromCart: async (data) => {
      return await createResult(
        getInstance().patch("cart/productDeleteFromCart", data)
      );
    },
  },
  order: {
    getPastOrders: async (data) => {
      return await createResult(
        getInstance().get(`order/PastOrders?${querystring.stringify(data)}`)
      );
    },
    getPastOrder: async (order_id) => {
      return await createResult(
        getInstance().get(`order/PastOrders/${order_id}`)
      );
    },
    cancelOrder: async (order_id) => {
      return await createResult(
        getInstance().patch(`order/CancelOrder/${order_id}`)
      );
    },
    confirmOrder: async (order_id) => {
      return await createResult(
        getInstance().patch(`order/ConfirmOrder/${order_id}`)
      );
    },
  },
  truckTrip: {
    getSheduledTruckTrips: async (data) => {
      return await createResult(
        getInstance().get(`truckTrip/myTrip?${querystring.stringify(data)}`)
      );
    },
    getTruckTripDetails: async (truckTrip_id) => {
      return await createResult(
        getInstance().get(`truckTrip/truckTripDetails/${truckTrip_id}`)
      );
    },
    getTruckTripOrderDetails: async (truckTrip_id) => {
      return await createResult(
        getInstance().get(`truckTrip/truckTripOrderDetails/${truckTrip_id}`)
      );
    },
  },
  truckRoute: {
    getTruckRouteByID: async (truck_route_id) => {
      return await createResult(
        getInstance().get(`truck/truckRouteByID/${truck_route_id}`)
      );
    },
  },
  driver: {
    driverDetails: async () => {
      return await createResult(
        getInstance().get("driver/driverDetails")
      );
    },
    driverFullDetails: async (driver_id) => {
      return await createResult(
        getInstance().get(`driver/driverDetails/${driver_id}`)
      );
    },
  },
  delivery_manager: {
    newOrders: async () => {
      return await createResult(
          getInstance().get('deliveryManager/NewOrders')
      );
    },
    getNewOrderDetails: async (order_id) => {
      return await createResult(
          getInstance().get(`deliveryManager/NewOrder/${order_id}`)
      );
    }
  },
};
