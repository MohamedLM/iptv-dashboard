"use client"

import React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { Moon, Sun1 } from "iconsax-react";

export default function DarkModeSwitch() {
  const { setTheme, resolvedTheme } = useNextTheme();

  return "dark" === resolvedTheme ? (
    <div className="cursor-pointer select-none" onClick={() => setTheme("light")}>
      <Sun1 />
    </div>
  ) : (
    <div className="cursor-pointer select-none" onClick={() => setTheme("dark")}>
      <Moon />
    </div>
  );
}
