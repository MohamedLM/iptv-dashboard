"use client";

import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Notification } from "iconsax-react";
import { useSession } from "next-auth/react";
import { Bell, Inbox, Notifications } from "@novu/react";

const appearance = {
  // variables: {
  //   colorBackground: 'var(--nextui-content1)',
  //   colorForeground: 'blue',
  // },
  elements: {
    // button: {
    //   background: 'transparent!important'
    // },
    popoverTrigger: {
      background: "transparent!important",
      marginBottom: "-3px",
    },
    popoverContent: {
      // opacity: 1,
      // background: 'hsl(var(--nextui-content1) / var(--nextui-content1-opacity, var(--tw-bg-opacity)))',
      marginTop: "10px",
      marginLeft: "-10px",
    },
    // bellContainer: {
    //   background: "red",
    // },
    // You can also pass your custom CSS classes
    // bellIcon: "xxxxxxx",
    // bellDot: {
    //   colorBackground: 'red',
    //   colorForeground: 'white',
    //   borderRadius: '0.5rem',
    // },
  },
};

export default function NotificationsDropdown() {
  const [openNotification, setOpenNotification] = useState(false);
  const { data } = useSession();

  return (
    data?.user.id && (
      <Inbox
        applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_IDENTIFIER!}
        subscriberId={data?.user?.id!}
        appearance={appearance}
        renderBell={({ unreadCount }) => {
          return (
            <div className="relative bg-transparent hover:bg-transparent">
              <Badge content={unreadCount} color="primary">
                <Notification className="text-foreground" />
              </Badge>
            </div>
          );
        }}
        onPrimaryActionClick={(x) => {
          alert('dasdas')
          console.log('xx',x)
        }}
      />
    )
  );

  return (
    data?.user.id && (
      <Inbox
        applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_IDENTIFIER!}
        subscriberId={data?.user?.id!}
      >
        <div className="cursor-pointer">
          <NavbarItem className="-mb-2">
            <Bell>
              {({ unreadCount }) => (
                <div onClick={() => setOpenNotification(!openNotification)}>
                  <Badge content={unreadCount} color="primary">
                    <Notification className="text-foreground" />
                  </Badge>
                </div>
              )}
            </Bell>
          </NavbarItem>
          <Popover
            disableAnimation={true}
            placement="bottom"
            shouldBlockScroll
            isOpen={openNotification}
            onOpenChange={setOpenNotification}
            offset={30}
          >
            <PopoverTrigger>
              <span />
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2 flex flex-col gap-2">
                <div>Header</div>
                <div className="min-w-[300px] max-h-[300px] overflow-auto">
                  <Notifications
                    onNotificationClick={(e) =>
                      console.log("onNotificationClick")
                    }
                    onPrimaryActionClick={(e) =>
                      console.log("onPrimaryActionClick")
                    }
                    onSecondaryActionClick={(e) =>
                      console.log("onSecondaryActionClick")
                    }
                  >
                    {({ notification }) => {
                      if (notification.isRead || notification.isArchived) {
                        return null;
                      }

                      return (
                        <div className="text-foreground py-2" onClick={() => notification.completePrimary()}>
                          <pre>{JSON.stringify(notification, null, 2)}</pre>
                        </div>
                      );
                    }}
                  </Notifications>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Inbox>
    )
  );

  return (
    <Inbox
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_IDENTIFIER!}
      subscriberId={data?.user?.id!}
    >
      <Dropdown placement="bottom-end">
        <DropdownTrigger className="cursor-pointer">
          <NavbarItem>
            <Bell>{({ unreadCount }) => <Notification />}</Bell>
          </NavbarItem>
        </DropdownTrigger>
        <DropdownMenu className="w-80" aria-label="Avatar Actions">
          <DropdownSection title="Notificacions">
            <DropdownItem
              classNames={{
                base: "py-2",
                title: "text-base font-semibold",
              }}
              key="1"
              description="Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
            >
              <Notifications />
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </Inbox>
  );
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger className="cursor-pointer">
        <NavbarItem>
          <Notification />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notificacions">
          <DropdownItem
            classNames={{
              base: "py-2",
              title: "text-base font-semibold",
            }}
            key="1"
            description="Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
          >
            📣 Edit your information
          </DropdownItem>
          <DropdownItem
            key="2"
            classNames={{
              base: "py-2",
              title: "text-base font-semibold",
            }}
            description="Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
          >
            🚀 Say goodbye to paper receipts!
          </DropdownItem>
          <DropdownItem
            key="3"
            classNames={{
              base: "py-2",
              title: "text-base font-semibold",
            }}
            description="Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
          >
            📣 Edit your information
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
