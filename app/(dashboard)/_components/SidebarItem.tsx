import React from "react";
import clsx from "clsx";
import { useDashboardContext } from "@/contexts/dashboard";
import Link from "next/link";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export default function SidebarItem({
  icon,
  title,
  isActive,
  href = "",
}: Props) {
  const { sidebarOpen, toggleSidebar } = useDashboardContext();

  const handleClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  return (
    <Link
      href={href}
      className="text-default-900 active:bg-none max-w-full"
    >
      <div
        className={clsx(
          isActive
            ? "bg-primary-100 [&_svg_path]:fill-primary-500"
            : "hover:bg-default-100",
          "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]",
        )}
        onClick={handleClick}
      >
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </Link>
  );
}
