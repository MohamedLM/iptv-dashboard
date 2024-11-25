import { Capability, RawRole } from "@/types/rbac";

export const capabilities: Capability[] = [
  {
    key: "trials",
    label: "Trials",
  },
  {
    key: "orders",
    label: "Orders",
  },
  {
    key: "customers",
    label: "Customers",
  },
];

export const defaultRoles: RawRole[] = [
  {
    role: "admin",
    label: "Admin",
    default: true,
    can: ["*"],
  },
  {
    role: "user",
    label: "User",
    default: true,
    can: ["account:*"],
  },
];

export const actions = ["view", "edit"];
