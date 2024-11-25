import { MenuProps } from "@/types/dashboard";
import { Global, IconProps, KeySquare, MessageProgramming, SecurityUser } from "iconsax-react";

const ICON_PROPS: IconProps = {
  variant: "Bulk",
  size: 28,
};

const menus: MenuProps[] = [
  {
    title: "Configurations",
    menus: [
      {
        title: "Sites",
        icon: <Global {...ICON_PROPS} />,
        path: "sites",
        cap: "sites:view",
      },
      {
        title: "Users",
        icon: <SecurityUser {...ICON_PROPS} />,
        path: "users",
        cap: "users:view",
      },
      {
        title: "Permissions",
        icon: <KeySquare {...ICON_PROPS} />,
        path: "roles",
        cap: "settings:view",
      },
      {
        title: "Email Templates",
        icon: <MessageProgramming {...ICON_PROPS} />,
        path: "email-templates",
        cap: "email-templates:view",
      },
    ],
  },
];

export default menus;
