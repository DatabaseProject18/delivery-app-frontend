import React from "react";
import { Redirect, Route } from "react-router-dom";
import { isLogin } from "../../services/auth";
import { CFade } from "@coreui/react";

const ProtectedRoute = ({ isLoggedIn, userType, location, ...rest }) => {
  if (!isLoggedIn) {
    return <Route {...rest} />;
  }

  const user = isLogin();

  if (user) {
    if (!userType || (userType && userType.indeOf(user.user_type) !== -1)) {
      return <Route {...rest} />;
    }
  }
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
};

export default ProtectedRoute;
