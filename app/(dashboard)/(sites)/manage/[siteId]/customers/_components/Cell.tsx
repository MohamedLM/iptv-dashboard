"use client";

import Tags from "@/components/table-cell/Tags";
import { formatDate } from "@/utils/date";
import { User } from "@nextui-org/react";
import { Key } from "react";
// import CellActions from "./CellActions";

export default function RenderCell(data: any, columnKey: Key, canEdit?: boolean) {
  // @ts-ignore
  const cellValue = data[columnKey];
  switch (columnKey) {
    case "name": {
      return (
        <User
          name={cellValue}
          description={data.email}
        />
      );
    }

    case "tags": {
      return <Tags id={data.id} tagsData={cellValue} canEdit={canEdit} />;
    }

    case "createdAt": {
      return formatDate(cellValue);
    }

    default:
      return cellValue;
  }
}
