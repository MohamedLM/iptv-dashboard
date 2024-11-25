"use client";
import { useLockedBody } from "@/hooks/useBodyLock";
import { SessionProvider } from "next-auth/react";
import { ThemeProviderProps } from "next-themes/dist/types";
import RBAC from "easy-rbac";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
  useReducer,
} from "react";
import { MenuProps } from "@/types/dashboard";
import { RawRole } from "@/types/rbac";

type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

interface ModalState {
  open: boolean;
  content: ReactNode | null;
  size: ModalSize;
}

interface ModalAction {
  type: string;
  content?: ReactNode;
  size?: ModalSize;
}

interface DashboardContext {
  role: string;
  roles: Array<RawRole>;
  modal: ModalState;
  dispatchModal: Dispatch<ModalAction>;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  [key: string]: any;
}

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  const { type, ...payload } = action;
  switch (type) {
    case "open": {
      return {
        ...state,
        ...payload,
        open: true,
        size: payload.size ? payload.size : "md", // default size is set when opening instead of when closing to avoid glitch when closing the popup.
      };
    }
    case "close": {
      return {
        ...state,
        open: false,
        content: null, // clear out the content
      };
    }
    default:
      return state;
  }
};

const useContextValue = (value: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [_, setLocked] = useLockedBody(false);
  const [modalState, modalDispatch] = useReducer(modalReducer, {
    open: false,
    content: null,
    size: "md",
  });
  const role = value?.role || "user";

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  }, [sidebarOpen]);

  return {
    ...value,
    modal: modalState,
    dispatchModal: modalDispatch,
    role,
    sidebarOpen,
    toggleSidebar: handleToggleSidebar,
  };
};

export const dashboardContext = createContext<DashboardContext>({
  role: "user",
  roles: [],
  modal: { open: false, content: null, size: "md" },
  dispatchModal: (params: ModalAction) => {},
  sidebarOpen: false,
  toggleSidebar: () => {},
});

export const useDashboardContext = () => {
  return useContext(dashboardContext);
};

export default function DashboardProvider({
  value,
  themeProps,
  children,
}: {
  value: { [key: string]: any };
  themeProps?: ThemeProviderProps;
  children: ReactNode;
}) {
  const contextValue = useContextValue(value);
  return (
    <dashboardContext.Provider value={contextValue}>
      <SessionProvider basePath="/auth">{children}</SessionProvider>
    </dashboardContext.Provider>
  );
}
