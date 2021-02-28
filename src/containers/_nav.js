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
    name: "Drivers",
    to: "/drivers",
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
  {
    _tag: 'CSidebarNavDivider',
    userType: ["company_manager"],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Report'],
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales Income",
    to: "/yearly-income",
    icon: <CIcon name="cil-graph" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales of Products",
    to: "/most-ordered-product",
    icon: <CIcon name="cil-gift" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales Income of Each City",
    to: "/sales-income-city",
    icon: <CIcon name="cil-map" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Working Hours',
    icon: 'cil-av-timer',
    userType: ["company_manager"],
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Drivers',
        to: '/working-hours/drivers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Driver Assistants',
        to: '/working-hours/driver-assistants',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Trucks',
        to: '/working-hours/trucks',
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Customer Order",
    to: "/customer-order",
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
    userType: ["company_manager"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Driver Assistants",
    to: "/driverAssistants",
    icon: <CIcon name="cil-group" customClasses="c-sidebar-nav-icon" />,
    userType: "store_manager",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Users",
    to: "/users",
    icon: <CIcon name="cil-group" customClasses="c-sidebar-nav-icon" />,
    userType: "company_manager",
  },
];

export default _nav;
