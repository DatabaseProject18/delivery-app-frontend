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
  },
];

export default _nav;
