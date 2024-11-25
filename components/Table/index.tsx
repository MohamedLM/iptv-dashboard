"use client";

import {
  Table as NextTable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableProps,
  Selection,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  getKeyValue,
  Badge,
} from "@nextui-org/react";
import { Key, ReactNode, useEffect, useMemo, useState } from "react";
import { AddSquare, ArrowDown2, DocumentFilter } from "iconsax-react";
import TopContent, { Props as TopContentProps } from "./TopContent";
import BottomContent, { Props as BottomContentProps } from "./BottomContent";
import { useQueryState } from "nuqs";

interface Props {
  columns: Array<{ key: string; name: string; sortable?: boolean }>;
  defaultVisibleColumns?: Array<string>;
  data: Array<{ id: string; [key: string]: any }>;
  total: number;
  buttonActions?: ReactNode;
  renderCell?: (item: any, key: Key, canEdit?: boolean) => ReactNode;
  tableProps?: TableProps;
  topContentProps?: TopContentProps;
  bottomContentProps?: BottomContentProps;
  canEdit?: boolean;
  withoutFilter?: boolean;
}

export default function Table({
  columns = [],
  defaultVisibleColumns = [],
  data = [],
  total = 0,
  buttonActions,
  renderCell,
  tableProps,
  topContentProps,
  bottomContentProps,
  canEdit,
  withoutFilter,
  ...props
}: Props) {
  const [sort, setSort] = useQueryState("sort", { shallow: false });
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    defaultVisibleColumns.length
      ? new Set(defaultVisibleColumns)
      : new Set(columns.map((c) => c.key))
  );

  const [sortCol, sortDir] = sort
    ? String(sort).split("--")
    : ["createdAt", "descending"];

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: sortCol,
    direction: sortDir as SortDescriptor["direction"],
  });

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns, columns]);

  const isColumnFiltered = useMemo(() => {
    const visibleCount =
      "all" === visibleColumns
        ? columns.length
        : Array.from(visibleColumns).length;

    return columns.length > visibleCount;
  }, [columns, visibleColumns]);

  const topContentActions = useMemo(() => {
    return (
      <>
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <span className="cursor-pointer">
              <Badge
                content={isColumnFiltered ? "" : undefined}
                color="primary"
              >
                <DocumentFilter />
              </Badge>
            </span>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {columns
              .filter((c) => "actions" !== c.key)
              .map((column) => (
                <DropdownItem key={column.key} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
        {buttonActions}
      </>
    );
  }, [visibleColumns, buttonActions, columns, isColumnFiltered]);

  useEffect(() => {
    const isDefault =
      "createdAt" === sortDescriptor.column &&
      "descending" === sortDescriptor.direction;
    if (isDefault) {
      setSort(null);
    } else {
      setSort(`${sortDescriptor.column}--${sortDescriptor.direction}`);
    }
  }, [sortDescriptor, setSort]);

  return (
    <NextTable
      ariaLabel="Display data as table"
      topContent={
        !withoutFilter && (
          <TopContent searchPlaceholder={topContentProps?.searchPlaceholder}>
            {topContentActions}
          </TopContent>
        )
      }
      topContentPlacement="outside"
      bottomContent={
        <BottomContent
          numOfItems={data?.length || 0}
          totalItems={total}
          itemPerpage={20}
          {...bottomContentProps}
        />
      }
      bottomContentPlacement="outside"
      {...tableProps}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              const cellValue = renderCell
                ? renderCell(item, columnKey, canEdit)
                : getKeyValue(item, columnKey);
              return <TableCell>{cellValue}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </NextTable>
  );
}
