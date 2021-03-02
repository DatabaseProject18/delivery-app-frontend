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

const createResult = async(promise) => {
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
            result.data.error &&
            (result.data.error.single === "Authorization token is not provided" ||
                result.data.error.single === "Authorization token is invalid")
        ) {
            const res = await getInstance().post("renewAccessToken", {
                refreshToken: localStorage.getItem("scms-refresh-token"),
            });
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("scms-auth-token", res.data.data.single);
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
            register: async(data) => {
                return await createResult(getInstance().post("register", data));
            },
            login: async(data) => {
                return await createResult(getInstance().post("login", data));
            },
            logout: async(data) => {
                return await createResult(getInstance().post("logout", data));
            },
        },
        customer: {
            getCustomerTypes: async() => {
                return await createResult(getInstance().get("customer/types"));
            },
        },
        cart: {
            getCart: async(data) => {
                return await createResult(
                    getInstance().get(`cart?${querystring.stringify(data)}`)
                );
            },
            setCartQuntity: async(data) => {
                return await createResult(getInstance().patch("cart/cartQuantity", data));
            },
            productDeleteFromCart: async(data) => {
                return await createResult(
                    getInstance().patch("cart/productDeleteFromCart", data)
                );
            },
        },
        order: {
            getPastOrders: async(data) => {
                return await createResult(
                    getInstance().get(`order/PastOrders?${querystring.stringify(data)}`)
                );
            },
            getPastOrder: async(order_id) => {
                return await createResult(
                    getInstance().get(`order/PastOrders/${order_id}`)
                );
            },
            getOrdersByStatus: async() => {
                return await createResult(getInstance().get(`order/order-count-by-status`));
            },
            cancelOrder: async(order_id) => {
                return await createResult(
                    getInstance().patch(`order/CancelOrder/${order_id}`)
                );
            },
            confirmOrder: async(order_id) => {
                return await createResult(
                    getInstance().patch(`order/ConfirmOrder/${order_id}`)
                );
            },
            createOrder: async(order_id) => {
                return await createResult(
                    getInstance().patch('order/CreateOrder/${order_id}')
                );
            },
        },
        truckTrip: {
            getSheduledTruckTrips: async(data) => {
                return await createResult(
                    getInstance().get(`truckTrip/myTrip?${querystring.stringify(data)}`)
                );
            },
            getTruckTripDetails: async(truckTrip_id) => {
                return await createResult(
                    getInstance().get(`truckTrip/truckTripDetails/${truckTrip_id}`)
                );
            },
            getTruckTripOrderDetails: async(truckTrip_id) => {
                return await createResult(
                    getInstance().get(`truckTrip/truckTripOrderDetails/${truckTrip_id}`)
                );
            },
        },
        truckRoute: {
            getTrucks: async(data) => {
                return await createResult(
                    getInstance().get(`truck/trucks?${querystring.stringify(data)}`)
                );
            },
            getTruckRouteByID: async(truck_route_id) => {
                return await createResult(
                    getInstance().get(`truck/truckRouteByID/${truck_route_id}`)
                );
            },
            getTruckRoutes: async(data) => {
                return await createResult(
                    getInstance().get(`truck/truckRoutes?${querystring.stringify(data)}`)
                );
            },
        },
        driver: {
            driverDetails: async(store_manager_id) => {
                return await createResult(
                    getInstance().get(
                        `driver/driverDetails?store_manager_id=${store_manager_id}`
                    )
                );
            },
            driverFullDetails: async(driver_id) => {
                return await createResult(
                    getInstance().get(`driver/driverDetails/${driver_id}`)
                );
            },
        },

        delivery_manager: {
            newOrders: async() => {
                return await createResult(
                    getInstance().get('deliveryManager/NewOrders')
                );
            },
            getNewOrderDetails: async(order_id) => {
                return await createResult(
                    getInstance().get(`deliveryManager/NewOrder/${order_id}`)
                );
            }
        },
        report: {
            getYearlyIncome: async() => {
                return await createResult(getInstance().get("report/years-income"));
            },
            getQuarterlyIncome: async(year) => {
                return await createResult(
                    getInstance().get(`report/year-quarterly-income?year=${year}`)
                );
            },
            getBasicOrderDetailsOfQuarter: async(year, quarter) => {
                return await createResult(
                    getInstance().get(
                        `report/year-quarter-orders-basic?year=${year}&quarter=${quarter}`
                    )
                );
            },
            getOrderCountOfProducts: async(year) => {
                if (year) {
                    return await createResult(
                        getInstance().get(`report/product-ordered-count?year=${year}`)
                    );
                }
                return await createResult(
                    getInstance().get(`report/product-ordered-count`)
                );
            },
            getYears: async() => {
                return await createResult(getInstance().get("report/all-years"));
            },
            getCityRouteIncome: async(year) => {
                if (year) {
                    return await createResult(
                        getInstance().get(`report/city-route-income?year=${year}`)
                    );
                }
                return await createResult(getInstance().get(`report/city-route-income`));
            },
            getDriverWorkingHours: async(year, month) => {
                    return await createResult(
                            getInstance().get(
                                `report/working-hours/drivers${year || month ? `?` : ``}${
            year ? `year=${year}` : ``
          }${year && month ? `&` : ``}${month ? `month=${month}` : ``}`
        )
      );
    },
    getDriverAssistantWorkingHours: async (year, month) => {
      return await createResult(
        getInstance().get(
          `report/working-hours/driver-assistants${year || month ? `?` : ``}${
            year ? `year=${year}` : ``
          }${year && month ? `&` : ``}${month ? `month=${month}` : ``}`
        )
      );
    },
    getTruckUsedHours: async (year, month) => {
      return await createResult(
        getInstance().get(
          `report/used-hours/trucks${year || month ? `?` : ``}${
            year ? `year=${year}` : ``
          }${year && month ? `&` : ``}${month ? `month=${month}` : ``}`
        )
      );
    },
    getCustomerOrders: async (year) => {
      return await createResult(
        getInstance().get(`report/customer-order${year ? `?year=${year}` : ``}`)
      );
    },
    getCustomerOrderBasicDetails: async (customerId) => {
      return await createResult(
        getInstance().get(
          `report/customer-order-basic-details?customerId=${customerId}`
        )
      );
    },
  },
  driverAssistant: {
    driverAssistantDetails: async (store_manager_id) => {
      return await createResult(
        getInstance().get(
          `driverAssistant/driverAssistantDetails?store_manager_id=${store_manager_id}`
        )
      );
    },
    driverAssistantFullDetails: async (driver_assistant_id) => {
      return await createResult(
        getInstance().get(
          `driverAssistant/driverAssistantDetails/${driver_assistant_id}`
        )
      );
    },
  },
  user: {
    userDetails: async () => {
      return await createResult(getInstance().get("user/userDetails"));
    },
    userFullDetails: async (user_id) => {
      return await createResult(
        getInstance().get(`user/userDetails/${user_id}`)
      );
    },

  },
};