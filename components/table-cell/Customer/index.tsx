"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import { SelectCustomer } from "@/database/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  User,
} from "@nextui-org/react";
import { DocumentText1, UserSquare } from "iconsax-react";
import dynamic from "next/dynamic";
const ModalViewCustomer = dynamic(() => import("./ModalViewCustomer"), {
  ssr: false,
});

export default function Customer({
  customer,
  data,
}: {
  customer: SelectCustomer;
  data?: any;
}) {
  const { dispatchModal } = useDashboardContext();

  if (!customer?.id) {
    return null;
  }

  return (
    <div className="flex justify-between w-full">
      <User name={customer.name} description={customer.email} />
      <div className="flex gap-1 cursor-pointer">
        {data?.notes && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <DocumentText1
                size={20}
                className="text-default-500 hover:text-primary"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-1">
                <div className="text-small font-bold">Notes</div>
                <div className="text-tiny">{data.notes}</div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Tooltip content="View customer">
          <UserSquare
            size={20}
            className="text-default-500 hover:text-primary"
            onClick={() =>
              dispatchModal({
                type: "open",
                content: <ModalViewCustomer customer={customer} />,
              })
            }
          />
        </Tooltip>
      </div>
    </div>
  );
}
