import React from "react";
import { isLogin } from "../../services/auth";
import CompanyManagerDashboard from "./companyManagerDashboard";
import SearchPage from "../pages/landing/mainSearch";
import AdminDashboard from "./adminDashboard";

const Dashboard = ({ history }) => {
  const user = isLogin();

  if (user) {
    switch (user.user_type) {
      case "company_manager":
        return <CompanyManagerDashboard />;
      case "customer":
        return <SearchPage history={history} />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>This is a default dashboard</div>;
    }
  }
};

export default Dashboard;
