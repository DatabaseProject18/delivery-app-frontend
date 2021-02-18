import React, { useState } from "react";
import { TheContent, TheFooter, TheHeader, TheSidebar } from "./index";

const TheLayout = () => {
  const [sidebarShow, setSidebarShow] = useState("responsive");

  return (
    <div className="c-app c-default-layout">
      <TheSidebar sidebarShow={sidebarShow} onSidebarChange={setSidebarShow} />
      <div className="c-wrapper">
        <TheHeader sidebarShow={sidebarShow} onSidebarChange={setSidebarShow} />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
