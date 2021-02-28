import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Cart = React.lazy(() => import("./views/cart/Cart"));
const MyOrders = React.lazy(() => import("./views/orders/Orders"));
const MyOrder = React.lazy(() => import("./views/orders/Order"));
const MyTrips = React.lazy(() => import("./views/myTrips/MyTrips"));
const TripsDetails = React.lazy(() => import("./views/myTrips/TripDetails"));
const DriverDetails = React.lazy(() => import("./views/driver/driverDetails"));
const SingleDriver = React.lazy(() => import("./views/driver/singleDriver"));
const DriverAssistantDetails = React.lazy(() => import("./views/driverAssistant/driverAssistantDetails"));
const SingleDriverAssistant = React.lazy(() => import("./views/driverAssistant/singleDriverAssistant"));
const Users = React.lazy(() => import("./views/user/users"));
const User = React.lazy(() => import("./views/user/user"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/cart", name: "Cart", component: Cart },
  { path: "/my-orders/:order_id", name: "Order", component: MyOrder },
  { path: "/my-orders", name: "MyOrders", component: MyOrders },
  { path: "/my-trips/:trip_id", name: "Details", component: TripsDetails },
  { path: "/my-trips", name: "MyTrips", component: MyTrips },
  {
    path: "/drivers/:driver_id",
    name: "Full Driver Details",
    component: SingleDriver,
  },
  { path: "/drivers", name: "Driver Details", component: DriverDetails },
  {
    path: "/driverAssistants/:driver_assistant_id",
    name: "Full Driver Assistant Details",
    component: SingleDriverAssistant,
  },
  { path: "/driverAssistants", name: "Driver Assistant Details", component: DriverAssistantDetails },
  {
    path: "/users/:user_id",
    name: "Full User Details",
    component: User,
  },
  { path: "/users", name: "User Details", component: Users },
];

export default routes;
