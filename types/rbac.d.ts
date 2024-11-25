export type RoleObject = {
  name: string;
  when: (params: object) => Promise<boolean>;
};

export type Roles = {
  [key: string]: {
    can: Array<string | RoleObject>;
    inherits?: string[] | undefined;
  };
};

export type RawRole = {
  role: string;
  label: string;
  default?: boolean;
  can: string[];
  inherits?: string[];
};

export type Capability = {
  key: string;
  label: string;
};

export type PermissionObject = {
  feature: string;
  action: string;
};

export type MappedRole = {
  role: string;
  label: string;
  [key: string]: any;
};
