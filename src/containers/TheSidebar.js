import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarMinimizer,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarNavTitle,
} from "@coreui/react";
import React from "react";
import { Redirect } from "react-router-dom";
import { isLogin } from "../services/auth";
// sidebar nav config
import navigation from "./_nav";

const TheSidebar = ({ sidebarShow, onSidebarChange, location }) => {
  const user = isLogin();
  let navItems = [];
  if (user) {
    navItems = navigation.filter((item) => {
      if (item.userType) {
        if (item.userType.indexOf(user.user_type) !== -1) {
          delete item.userType;
          return item;
        }
      } else {
        return item;
      }
    });
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            from: location,
          },
        }}
      />
    );
  }

  return (
    <CSidebar show={sidebarShow} onShowChange={(val) => onSidebarChange(val)}>
      <CSidebarBrand className="d-md-down-none" to="/">
        <p
          className="mt-2 c-sidebar-brand-full"
          style={{ color: "white", fontSize: "30px" }}
        >
          Lanka Express
        </p>
        <p
          className="mt-2 c-sidebar-brand-minimized"
          style={{ color: "white", fontSize: "30px" }}
        >
          LE
        </p>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navItems}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
