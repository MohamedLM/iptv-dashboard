"use client";

import { formatDate } from "@/utils/date";
import { User } from "@nextui-org/react";
import { Key } from "react";
import CellActions from "./CellActions";
// import CellActions from "./CellActions";

export default function RenderCell(data: any, columnKey: Key) {
  // @ts-ignore
  const cellValue = data[columnKey];
  switch (columnKey) {
    case "name": {
      return (
        <User
          name={cellValue}
          description={data.email}
          avatarProps={{
            src: data.image,
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
