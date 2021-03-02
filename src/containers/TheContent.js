import { CContainer, CFade } from "@coreui/react";
import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
// routes config
import routes from "../routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <ProtectedRoute
                    isLoggedIn={route.isLoggedIn}
                    userType={route.userType}
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                )
              );
            })}
            <Redirect from="/my" to="/my/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
