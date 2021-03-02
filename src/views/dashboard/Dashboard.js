import React from "react";
import { isLogin } from "../../services/auth";
import CompanyManagerDashboard from "./companyManagerDashboard";
import Driver_DriverAssistant from "./Driver_DriverAssistant";

const Dashboard = () => {
  const user = isLogin();

  if (user) {
    switch (user.user_type) {
      case "company_manager":
        return <CompanyManagerDashboard />;
      case "driver":
        return <Driver_DriverAssistant />;
      case "driver_assistant":
        return <Driver_DriverAssistant />;
      default:
        return <div>This is a default dashboard</div>;
    }
  }
};

export default Dashboard;
