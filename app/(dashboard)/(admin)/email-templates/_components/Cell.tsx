"use client";

import { formatDate } from "@/utils/date";
import { Key } from "react";
import CellActions from "./CellActions";
import { User } from "@nextui-org/react";

export default function RenderCell(data: any, columnKey: Key) {
  // @ts-ignore
  const cellValue = data[columnKey];
  switch (columnKey) {
    case "name": {
      return (
        <User
          name={cellValue}
          description={data.id}
          avatarProps={{
            name: data?.name ? data.name.charAt(0) : "",
            radius: "md",
          }}
        />
      );
    }

    case "createdAt": {
      return formatDate(cellValue);
    }

    case "actions": {
      return <CellActions data={data} />;
    }

    default:
      return cellValue;
  }
}
