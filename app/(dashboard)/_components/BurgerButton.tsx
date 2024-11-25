"use client"

import { StyledBurgerButton } from "./styles/navbar.styles";
import { useDashboardContext } from "@/contexts/dashboard";

export default function BurgerButton() {
  const { sidebarOpen, toggleSidebar } = useDashboardContext();
  return (
    <div
      className={StyledBurgerButton()}
      // open={sidebarOpen}
      onClick={toggleSidebar}
    >
      <div />
      <div />
    </div>
  );
}
