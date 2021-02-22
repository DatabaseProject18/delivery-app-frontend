import React from "react";
import { isLogin } from "../../services/auth";

const Dashboard = () => {
  console.log(isLogin());
  return (
    <>
      <div>This is a dashboard</div>
    </>
  );
};

export default Dashboard;
