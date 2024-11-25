"use client";
import { actualEndDateMap } from "@/utils/date";
import { Select, SelectItem } from "@nextui-org/react";
import map from "lodash/map";
import { parseAsString, useQueryState } from "nuqs";

const periods = map(actualEndDateMap, (o, key) => {
  return {
    key,
    label: o.label,
  };
}).filter(Boolean) as Array<{ key: string; label: string }>;

export default function ActionButtons() {
  const [requestDate, setRequestDate] = useQueryState(
    "requestDate",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  const handleChangeDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequestDate("" === e.target.value ? null : e.target.value);
  };

  return (
    <>
      <Select
        items={[{ key: "", label: "All" }, ...periods]}
        label="Request Date"
        placeholder="Change filter"
        className="min-w-[150px]"
        size="sm"
        defaultSelectedKeys={[requestDate]}
        onChange={handleChangeDate}
        disallowEmptySelection
      >
        {(item) => <SelectItem key={`${item.key}`}>{item.label}</SelectItem>}
      </Select>
    </>
  );
}
