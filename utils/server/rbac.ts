import { auth } from "@/auth";
import RBAC from "easy-rbac";
import { actions, capabilities, defaultRoles } from "../constants";
import { getSetting } from "@/libs/setting";
import mapValues from "lodash/mapValues";
import keyBy from "lodash/keyBy";
import _ from "lodash";
import { cache } from "react";
import { MappedRole, PermissionObject, RawRole, Roles } from "@/types/rbac";
import { getuserRoleForSite } from "@/libs/site";

const mapRolesToRbacOptions = (roles: any[]): Roles => {
  return mapValues(keyBy(roles, "role"), ({ can, inherits }) => ({
    can,
    inherits,
  }));
};

export const getRoles = cache(
  async (asRbacOptions?: boolean): Promise<RawRole[] | Roles> => {
    const rolesArray = (await getSetting("customRoles", "[]")
      .then((value) => {
        console.log("getRoles", asRbacOptions);
        if (!value) value = "[]"; // to avoid error when trying to parse the json.
        const customRoles = JSON.parse(value);
        return [...defaultRoles, ...customRoles];
      })
      .catch((error) => {
        console.log("getRoles:error", error);
        return defaultRoles;
      })) as Array<RawRole>;

    return !asRbacOptions ? rolesArray : mapRolesToRbacOptions(rolesArray);
  }
);

const getRecursivePermissions = (role: RawRole, roles: RawRole[]) => {
  let caps = _.flatten(role?.can);
  if (role?.inherits) {
    const inheritCaps = _.map(role.inherits, (role) => {
      const inheritRole = _.find(roles, { role });
      return inheritRole ? getRecursivePermissions(inheritRole, roles) : [];
    });

    caps = [...caps, ..._.flatten(inheritCaps)];
  }
  return caps;
};

export const getRolesWithCapabilites = async () => {
  const roles = (await getRoles(false)) as RawRole[];
  return _.chain(roles)
    .map((role): RawRole & { can: { [key: string]: string[] } } => {
      const permissions = getRecursivePermissions(role, roles);
      const mappedCan = _.chain(permissions)
        .map((c: string): PermissionObject => {
          const [feature, action] = c.split(":");
          return {
            feature,
            action,
          };
        })
        .groupBy("feature")
        .mapValues((v) => v.map((v) => v.action))
        .value() as string[] & { [key: string]: string[] };

      return {
        ...role,
        can: mappedCan,
      };
    })
    .map(({ can, ...role }): MappedRole => {
      const mappedCaps = _.mapValues(
        _.keyBy(capabilities, "key"),
        ({ key }) => {
          // allow all
          if (_.keys(can).includes("*")) {
            return actions;
          }
          const caps = _.get(can, [key], [""]);
          if (caps.includes("*")) {
            return actions;
          }

          return caps;
        }
      );

      return {
        ...role,
        ...mappedCaps,
      };
    })
    .value();
};

export const getRbac = cache(async () => {
  const roles = (await getRoles(true)) as Roles;
  const rbac = new RBAC(roles);
  return rbac;
});

export const isCurrentUserCan = async (cap: string) => {
  try {
    const session = await auth();
    const rbac = await getRbac();
    const role = session?.user?.role || "user";
    return rbac.can(role, cap);
  } catch (error) {
    return false;
  }
};

export const isRoleCan = async (role: string, cap: string) => {
  try {
    const rbac = await getRbac();
    return rbac.can(role, cap);
  } catch (error) {
    return false;
  }
};

export const getCurrentSiteUserRole = async (siteId: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("Not logged in!");
    let role = session?.user?.role || "user";
    if ("admin" !== role) {
      const siteRole = await getuserRoleForSite(session.user.id!, siteId);
      role = siteRole?.role || "user";
    }

    return role;
  } catch (error) {
    return "user";
  }
};

export const getCurrentSiteUserRoleCapabilites = cache(
  async (siteId: string) => {
    const role = await getCurrentSiteUserRole(siteId);
    const capabilities = await getRolesWithCapabilites();
    return _.find(capabilities, { role });
  }
);

export const isCurrentSiteUserCan = async (siteId: string, cap: string) => {
  try {
    const role = await getCurrentSiteUserRole(siteId);
    const can = await isRoleCan(role, cap);
    if (!can) throw new Error(`Role ${role} is not allowed!`);
    return true;
  } catch (error) {
    return false;
  }
};

export const filterRoleMenu = async (role: string, menus: any) => {
  return Promise.allSettled(
    menus.map(async (item: any) => {
      if (item.menus) {
        const menus = await filterRoleMenu(role, item.menus);
        // remove menu if no available / allowed submenus.
        if (!menus.length) {
          return false;
        }

        return {
          ...item,
          menus,
        };
      }
      if (item.cap) {
        const allowed = await isRoleCan(role, item.cap);
        return allowed && item;
      }
      return item;
    })
  ).then((items) => {
    return items
      .map((item) => {
        return (
          item.status === "fulfilled" && item.value !== false && item.value
        );
      })
      .filter(Boolean);
  });
};
