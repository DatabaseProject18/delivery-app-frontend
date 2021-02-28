import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Cart = React.lazy(() => import("./views/cart/Cart"));
const MyOrders = React.lazy(() => import("./views/orders/Orders"));
const MyOrder = React.lazy(() => import("./views/orders/Order"));
const MyTrips = React.lazy(() => import("./views/myTrips/MyTrips"));
const TripsDetails = React.lazy(() => import("./views/myTrips/TripDetails"));
const DriverDetails = React.lazy(() => import("./views/driver/driverDetails"));
const SingleDriver = React.lazy(() => import("./views/driver/singleDriver"));
const SheduledTruckTrips = React.lazy(() =>
  import("./views/truckTrip/SheduledTruckTrips")
);
const CreateTruckTrip = React.lazy(() =>
  import("./views/truckTrip/CreateTruckTrip")
);

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
    name: "FullDriverDetails",
    component: SingleDriver,
  },
  { path: "/drivers", name: "DriverDetails", component: DriverDetails },
  {
    path: "/sheduled-truck-trips",
    name: "Truck Trips",
    component: SheduledTruckTrips,
  },
  {
    path: "/create-truck-trips",
    name: "Create TruckTrip",
    component: CreateTruckTrip,
  },
];

export default routes;
