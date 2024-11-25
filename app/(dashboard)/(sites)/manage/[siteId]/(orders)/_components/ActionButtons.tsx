"use client";
import { actualEndDateMap, getActualStartEndDate } from "@/utils/date";
import { Select, SelectItem } from "@nextui-org/react";
import map from "lodash/map";
import { parseAsString, useQueryState } from "nuqs";

const periods = map(actualEndDateMap, (o, key) => {
  return {
    key,
    label: o.label,
  };
}).filter(Boolean) as Array<{ key: string; label: string }>;

const credentialStatuses = [
  {
    key: "",
    label: "All",
  },
  {
    key: "unprocessed",
    label: "Unprocessed",
  },
  {
    key: "processed",
    label: "Processed",
  },
  {
    key: "expired",
    label: "Expired",
  },
  {
    key: "expiredSoon",
    label: "Expired soon",
  },
];

export default function ActionButtons() {
  const [credential, setCredential] = useQueryState(
    "credential",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  const [requestDate, setRequestDate] = useQueryState(
    "requestDate",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  const handleChangeCredentialStatus = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCredential("" === e.target.value ? null : e.target.value);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequestDate("" === e.target.value ? null : e.target.value);
  };

  return (
    <>
      <Select
        items={credentialStatuses}
        label="Credential"
        placeholder="Filter status"
        className="min-w-[150px]"
        size="sm"
        defaultSelectedKeys={[credential]}
        onChange={handleChangeCredentialStatus}
        disallowEmptySelection
      >
        {(item) => <SelectItem key={`${item.key}`}>{item.label}</SelectItem>}
      </Select>
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
