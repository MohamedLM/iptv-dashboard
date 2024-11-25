import { MenuProps } from "@/types/dashboard";
import {
  CardRemove,
  CardTick1,
  FavoriteChart,
  Global,
  IconProps,
  MonitorMobbile,
  Profile2User,
  SecurityUser,
  Setting2,
  TimerStart,
} from "iconsax-react";
import { ReactNode } from "react";

const ICON_PROPS: IconProps = {
  variant: "Bulk",
  size: 28,
};

const menus: MenuProps[] = [
  {
    title: "Overview",
    icon: <FavoriteChart {...ICON_PROPS} />,
    path: "",
  },
  {
    title: "Menu",
    menus: [
      {
        title: "Trial Requests",
        icon: <TimerStart {...ICON_PROPS} />,
        path: "trials",
        cap: "trials:view",
      },
      {
        title: "Paid Subscriptions",
        icon: <CardTick1 {...ICON_PROPS} />,
        path: "orders",
        cap: "orders:view",
      },
      {
        title: "Abandoned",
        icon: <CardRemove {...ICON_PROPS} />,
        path: "uncompleted-orders",
        cap: "orders:view",
      },
      {
        title: "Customers",
        icon: <Profile2User {...ICON_PROPS} />,
        path: "customers",
        cap: "customers:view",
      },
    ],
  },
];

export default menus;
