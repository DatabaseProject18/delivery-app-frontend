import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Cart = React.lazy(() => import("./views/cart/Cart"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/cart", name: "Cart", component: Cart },
];

export default routes;
