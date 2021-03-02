import React from "react";
import { isLogin } from "../../services/auth";
import CompanyManagerDashboard from "./companyManagerDashboard";

const Dashboard = () => {
  const user = isLogin();

  if (user) {
    switch (user.user_type) {
      case "company_manager":
        return <CompanyManagerDashboard />;
      default:
        return <div>This is a default dashboard</div>;
    }
  }
};

export default Dashboard;
