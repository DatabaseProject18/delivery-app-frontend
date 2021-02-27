import CIcon from "@coreui/icons-react";
import React from "react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Cart",
    to: "/cart",
    icon: <CIcon name="cil-cart" customClasses="c-sidebar-nav-icon" />,
    userType: "customer",
  },
  {
    _tag: "CSidebarNavItem",
    name: "My Orders",
    to: "/my-orders",
    icon: <CIcon name="cil-balance-scale" customClasses="c-sidebar-nav-icon" />,
    userType: "customer",
  },
  {
    _tag: "CSidebarNavItem",
    name: "My Trips",
    to: "/my-trips",
    icon: <CIcon name="cil-truck" customClasses="c-sidebar-nav-icon" />,
    userType: ["driver", "driver_assistant"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Check Drivers",
    to: "/drivers",
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
];

export default _nav;
