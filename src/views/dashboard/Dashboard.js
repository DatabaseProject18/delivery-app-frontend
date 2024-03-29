import React from "react";
import { isLogin } from "../../services/auth";
import CompanyManagerDashboard from "./companyManagerDashboard";
import SearchPage from "../pages/landing/mainSearch";
import AdminDashboard from "./adminDashboard";
import Driver_DriverAssistant from "./Driver_DriverAssistant";

import Delivery_Manager from "../newOrders/newOrders";

import StoreManagerDashboard from "../truckTrip/CreateTruckTrip";


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
      case "driver":
        return <Driver_DriverAssistant />;
      case "driver_assistant":
        return <Driver_DriverAssistant />;
      case "delivery_manager":
        return <Delivery_Manager history={history}/>
      case "store_manager":
        return <StoreManagerDashboard />;
      default:
        return <div>This is a default dashboard</div>;
    }
  }
};

export default Dashboard;
