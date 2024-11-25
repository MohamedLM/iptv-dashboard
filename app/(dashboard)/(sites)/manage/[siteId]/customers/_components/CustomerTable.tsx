"use client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Selection,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FilterSearch, Send } from "iconsax-react";
import RenderCell from "./Cell";
import { parseAsString, useQueryState } from "nuqs";
import { useDashboardContext } from "@/contexts/dashboard";
import map from "lodash/map";
import { pick } from "lodash";
import dynamic from "next/dynamic";

const ModalSendEmails = dynamic(() => import("./ModalSendEmails"), {
  ssr: false,
});

const statuses = [
  {
    key: "",
    label: "All",
  },
  {
    key: "paid",
    label: "Paid",
  },
  {
    key: "trial",
    label: "Trial",
  },
  {
    key: "abandoned",
    label: "Abandoned",
  },
  {
    key: "expired",
    label: "Expired",
  },
];

const columns = [
  { name: "Customer Name", uid: "name" },
  { name: "Phone", uid: "phone" },
  { name: "Paid", uid: "paidOrder" },
  { name: "Trial", uid: "trialOrder" },
  { name: "Abandoned", uid: "abandonedOrder" },
  { name: "Expired", uid: "expiredOrder" },
  { name: "Tags", uid: "tags" },
  { name: "Date Created", uid: "createdAt" },
];

const ROWS_PERPAGE = 10;

export default function CustomerTable({
  siteId,
  data = [],
  canEdit,
}: {
  siteId: string;
  data: Array<any>;
  canEdit?: boolean;
}) {
  const { dispatchModal } = useDashboardContext();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((c) => c.uid))
  );
  const [filterOrder, setFilterOrder] = useQueryState(
    "filterOrder",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredDatas = [...data];

    if (hasSearchFilter) {
      filteredDatas = filteredDatas.filter((customer) =>
        customer["email"].toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // console.log("FILTERED", { filterValue, data, filteredDatas });

    return filteredDatas;
  }, [data, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / ROWS_PERPAGE);

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PERPAGE;
    const end = start + ROWS_PERPAGE;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleChangeFilterOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setSelectedKeys(new Set([]));
    setFilterOrder("" === e.target.value ? null : e.target.value);
  };

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const sendEmail = useCallback(() => {
    const datas = map(data, (d) => {
      const all = "all" === selectedKeys;
      if (!all && !Array.from(selectedKeys).includes(d.id)) {
        return false;
      }
      return pick(d, ["id", "name", "email"]);
    }).filter(Boolean);

    dispatchModal({
      type: "open",
      content: <ModalSendEmails siteId={siteId} data={datas} />,
    });
  }, [data, selectedKeys, siteId, dispatchModal]);

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[400px]"
          placeholder="Search..."
          startContent={<FilterSearch />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3 items-center">
          <Select
            label="Visible Columns"
            selectionMode="multiple"
            className="max-w-xs"
            size="sm"
            defaultSelectedKeys={visibleColumns}
            onSelectionChange={setVisibleColumns}
          >
            {columns.map((col) => (
              <SelectItem key={col.uid}>{col.name}</SelectItem>
            ))}
          </Select>
          <Select
            items={statuses}
            label="Order"
            placeholder="Filter order"
            className="min-w-[150px]"
            size="sm"
            defaultSelectedKeys={[filterOrder]}
            onChange={handleChangeFilterOrder}
            disallowEmptySelection
          >
            {(item) => (
              <SelectItem key={`${item.key}`}>{item.label}</SelectItem>
            )}
          </Select>
          <div>
            <Button
              isDisabled={"all" !== selectedKeys && selectedKeys.size < 1}
              onClick={sendEmail}
              color="primary"
              endContent={<Send />}
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        {pages > 1 ? (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        ) : null}
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Export data table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "p-0",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{RenderCell(item, columnKey, canEdit)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
