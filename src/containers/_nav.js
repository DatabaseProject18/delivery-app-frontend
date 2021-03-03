import CIcon from "@coreui/icons-react";
import React from "react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/my/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Cart",
    to: "/my/cart",
    icon: <CIcon name="cil-cart" customClasses="c-sidebar-nav-icon" />,
    userType: "customer",
  },
  {
    _tag: "CSidebarNavItem",
    name: "My Orders",
    to: "/my/my-orders",
    icon: <CIcon name="cil-balance-scale" customClasses="c-sidebar-nav-icon" />,
    userType: "customer",
  },
  {
    _tag: "CSidebarNavItem",
    name: "My Trips",
    to: "/my/my-trips",
    icon: <CIcon name="cil-truck" customClasses="c-sidebar-nav-icon" />,
    userType: ["driver", "driver_assistant"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Drivers",
    to: "/my/drivers",
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Create Truck Trip",
    to: "/my/create-truck-trips",
    icon: <CIcon name="cil-truck" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
  {
    _tag: "CSidebarNavDivider",
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Report"],
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales Income",
    to: "/my/yearly-income",
    icon: <CIcon name="cil-graph" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales of Products",
    to: "/my/most-ordered-product",
    icon: <CIcon name="cil-gift" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales Income of Each City",
    to: "/my/sales-income-city",
    icon: <CIcon name="cil-map" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Working Hours",
    icon: "cil-av-timer",
    userType: ["company_manager"],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Drivers",
        to: "/my/working-hours/drivers",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Driver Assistants",
        to: "/my/working-hours/driver-assistants",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Trucks",
        to: "/my/working-hours/trucks",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Customer Order",
    to: "/my/customer-order",
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Driver Assistants",
    to: "/my/driverAssistants",
    icon: <CIcon name="cil-group" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
  {
    _tag: "CSidebarNavDivider",
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Details"],
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Users",
    to: "/my/users",
    icon: <CIcon name="cil-group" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
];

export default _nav;
