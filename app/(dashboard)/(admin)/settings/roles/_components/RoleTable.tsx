"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import clsx from "clsx";
import { actions, capabilities } from "@/utils/constants";
import map from "lodash/map";
import { Trash } from "iconsax-react";
import { actionDeleteRole } from "../actions";

const columns = [
  {
    key: "role",
    label: "Role Name",
  },
  ...capabilities,
];

const RoleCheckboxes = ({
  columnKey,
  item,
}: {
  columnKey: string;
  item: {
    role: string;
    [key: string]: any;
  };
}) => {
  const value = item[columnKey] as string[];
  return (
    <div className="flex gap-4 justify-center mx-3">
      {map(actions, (action) => (
        <Checkbox
          key={action}
          name={
            item?.default ? undefined : `${item.role}[${columnKey}][${action}]`
          }
          defaultSelected={value.includes(action)}
          value="yes"
          isReadOnly={item?.default}
        >
          {action}
        </Checkbox>
      ))}
    </div>
  );
};

export default function RoleTable({ roles }: { roles: any[] }) {
  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm(`Are you sure to delete ${roleId} role?`) == true) {
      await actionDeleteRole(roleId);
    }
  };

  return (
    <Table
      shadow="none"
      radius="none"
      classNames={{
        wrapper: "p-0",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={clsx({
              "sticky left-0 z-[999] opacity-100 bg-default-100":
                "role" === column.key,
              "text-center": true,
            })}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={roles}>
        {(item) => (
          <TableRow key={item.role}>
            {(columnKey) => (
              <TableCell
                align="left"
                className={clsx({
                  "opacity-70": item.default,
                  "sticky left-0 z-[999] opacity-100 bg-default-100":
                    "role" === columnKey,
                })}
              >
                {"role" === columnKey ? (
                  item.default ? (
                    item.label
                  ) : (
                    <div className="flex justify-between gap-2 group">
                      <span>{item.label}</span>
                      <Trash
                        size={18}
                        onClick={() => handleDeleteRole(item.role)}
                        className="text-danger-500 cursor-pointer invisible group-hover:visible"
                      />
                    </div>
                  )
                ) : (
                  <RoleCheckboxes columnKey={`${columnKey}`} item={item} />
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
