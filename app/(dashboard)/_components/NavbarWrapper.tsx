import { Navbar, NavbarContent } from "@nextui-org/react";
import BurgerButton from "./BurgerButton";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";
import DarkModeSwitch from "./DarkModeSwitch";
import Breadcrumb from "./Breadcrumb";

interface Props {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: Props) {
  return (
    <div className="w-full">
      <Navbar isBordered maxWidth="full">
        <NavbarContent>
          <BurgerButton />
          {/* <Breadcrumb /> */}
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          {/* <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search..."
          /> */}
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <div className="max-md:hidden">
            <DarkModeSwitch />
          </div>

          <NotificationsDropdown />
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <div className="my-6 px-6 mx-auto w-full ">{children}</div>
    </div>
  );
}
