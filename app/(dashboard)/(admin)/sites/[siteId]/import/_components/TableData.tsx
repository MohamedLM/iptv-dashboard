import {
  ChangeEvent,
  Key,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  ChipProps,
  Select,
  SelectItem,
  Progress,
  User,
} from "@nextui-org/react";
import {
  Add,
  ArrowDown,
  CloudAdd,
  SearchFavorite,
  TagCross,
} from "iconsax-react";
import { map } from "lodash";
import { chunkArray } from "@/utils/common";

const IMPORT_PER_CHUNK = 5;

const INITIAL_VISIBLE_COLUMNS = [
  "Customer",
  "Order",
  "Phone (Billing)",
  "Country Code (Billing)",
  "Order Status",
  "Order Date",
  "Order Total Amount",
];

const columns = [
  { name: "Customer", uid: "Customer" },
  { name: "Order", uid: "Order" },
  { name: "Customer Note", uid: "Customer Note" },
  {
    name: "Company (Billing)",
    uid: "Company (Billing)",
  },
  {
    name: "Address 1&2 (Billing)",
    uid: "Address 1&2 (Billing)",
  },
  { name: "City (Billing)", uid: "City (Billing)" },
  {
    name: "State Code (Billing)",
    uid: "State Code (Billing)",
  },
  {
    name: "Postcode (Billing)",
    uid: "Postcode (Billing)",
  },
  {
    name: "Country Code (Billing)",
    uid: "Country Code (Billing)",
  },
  {
    name: "Email (Billing)",
    uid: "Email (Billing)",
  },
  {
    name: "Phone (Billing)",
    uid: "Phone (Billing)",
  },
  {
    name: "First Name (Shipping)",
    uid: "First Name (Shipping)",
  },
  {
    name: "Last Name (Shipping)",
    uid: "Last Name (Shipping)",
  },
  {
    name: "Address 1&2 (Shipping)",
    uid: "Address 1&2 (Shipping)",
  },
  {
    name: "City (Shipping)",
    uid: "City (Shipping)",
  },
  {
    name: "State Code (Shipping)",
    uid: "State Code (Shipping)",
  },
  {
    name: "Postcode (Shipping)",
    uid: "Postcode (Shipping)",
  },
  {
    name: "Country Code (Shipping)",
    uid: "Country Code (Shipping)",
  },
  {
    name: "Payment Method Title",
    uid: "Payment Method Title",
  },
  {
    name: "Cart Discount Amount",
    uid: "Cart Discount Amount",
  },
  {
    name: "Order Subtotal Amount",
    uid: "Order Subtotal Amount",
  },
  {
    name: "Shipping Method Title",
    uid: "Shipping Method Title",
  },
  {
    name: "Order Shipping Amount",
    uid: "Order Shipping Amount",
  },
  {
    name: "Order Refund Amount",
    uid: "Order Refund Amount",
  },
  {
    name: "Order Total Amount",
    uid: "Order Total Amount",
  },
  {
    name: "Order Total Tax Amount",
    uid: "Order Total Tax Amount",
  },
  { name: "SKU", uid: "SKU" },
  { name: "Item #", uid: "Item #" },
  { name: "Item Name", uid: "Item Name" },
  {
    name: "Quantity (- Refund)",
    uid: "Quantity (- Refund)",
  },
  { name: "Item Cost", uid: "Item Cost" },
  { name: "Coupon Code", uid: "Coupon Code" },
  {
    name: "Discount Amount",
    uid: "Discount Amount",
  },
  {
    name: "Discount Amount Tax",
    uid: "Discount Amount Tax",
  },
];

const renderCell = (data: any, columnKey: Key) => {
  const cellValue = data[String(columnKey)];

  switch (columnKey) {
    case "Customer":
      return (
        <User
          name={[
            data["First Name (Billing)"],
            data["Last Name (Billing)"],
          ].join(" ")}
          description={data["Email (Billing)"]}
        />
      );

    case "Order": {
      return data["Order Number"] ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            {data["Item Name"]}
          </span>
          <span className="text-tiny text-foreground-400 flex gap-1">
            {data["Order Number"]}
          </span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }
    default:
      return cellValue;
  }
};

export default function TableData({
  siteId,
  data = [],
  onReset,
}: {
  siteId: string;
  data: Array<any>;
  onReset: () => void;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

    console.log("data", data);

    // if (hasSearchFilter) {
    //   filteredDatas = filteredDatas.filter((data) =>
    //     data['Email (Billing)'].toLowerCase().includes(filterValue.toLowerCase())
    //   );
    // }

    return filteredDatas;
  }, [data]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleImport = useCallback(() => {
    setIsImporting(true);

    const datas =
      "all" === selectedKeys
        ? data
        : data.filter((d) =>
            Array.from(selectedKeys).includes(d["Order Number"])
          );

    const chunks = chunkArray(datas, IMPORT_PER_CHUNK);

    const doProcessChunk = async (index = 0) => {
      const data = chunks[index];
      console.log(`Processing `, index, data);
      return fetch(`/api/import-orders`, {
        method: "POST",
        headers: {
          "X-Site-Id": siteId,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res: any): any => {
          const newIndex = index + 1;
          const progress = (newIndex / chunks.length) * 100;
          setImportProgress(progress);
          if (chunks.length > newIndex) {
            return doProcessChunk(newIndex);
          }

          console.log("res", res);
          return true;
        });
    };

    doProcessChunk().then(() => {
      setTimeout(() => {
        setIsImporting(false);
        setImportProgress(0);
      }, 1000);
    });

    // const interval = setInterval(() => {
    //   if (_progress >= 100) {
    //     clearInterval(interval);
    //     setIsImporting(false);
    //     setImportProgress(0);
    //     return;
    //   }

    //   _progress = _progress + 10;
    //   setImportProgress(_progress);
    // }, 500);
  }, [data, selectedKeys, siteId]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchFavorite />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          /> */}
          <Button onClick={onReset}>Back</Button>
          <div className="flex gap-3 items-center">
            <Button
              color="primary"
              endContent={<CloudAdd />}
              onClick={handleImport}
              isDisabled={
                !data.length || isImporting || !Array.from(selectedKeys).length
              }
            >
              {isImporting ? "Importing..." : "Import Now"}
            </Button>
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
          </div>
        </div>
      </div>
    );
  }, [
    visibleColumns,
    data.length,
    selectedKeys,
    isImporting,
    handleImport,
    onReset,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
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
            <TableRow key={item["Order Number"]}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isImporting && (
        <Progress
          aria-label={100 >= importProgress ? "Import Done!" : "Importing..."}
          label="Importing..."
          size="sm"
          value={importProgress}
          color="success"
          showValueLabel={true}
          className="w-full"
        />
      )}
    </>
  );
}
