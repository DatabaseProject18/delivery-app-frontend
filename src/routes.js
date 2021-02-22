import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Cart = React.lazy(() => import("./views/cart/Cart"));
const Orders = React.lazy(() => import("./views/orders/Orders"));
const Order = React.lazy(() => import("./views/orders/Order"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/cart", name: "Cart", component: Cart },
  { path: "/my-orders/:order_id", name: "Order", component: Order },
  { path: "/my-orders", name: "MyOrders", component: Orders },
];

export default routes;
