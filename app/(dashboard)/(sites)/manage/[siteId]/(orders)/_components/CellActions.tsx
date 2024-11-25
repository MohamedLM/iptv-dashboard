"use client";
import { useDashboardContext } from "@/contexts/dashboard";
import VerticalDot from "@/components/icons/VerticalDot";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import ModalProcessRequest from "./ModalProcessRequest";

interface Props {
  data: any;
}

export default function CellActions({ data }: Props) {
  const { dispatchModal } = useDashboardContext();

  return (
    <div className="relative flex justify-end items-center gap-2">
      {/* <Tooltip content="View notes">
        <DocumentText1
          onClick={() => alert('View notes modal')}
          size={20}
          className="cursor-pointer active:opacity-50"
        />
      </Tooltip> */}
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDot />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            onClick={() => {
              dispatchModal({
                type: "open",
                content: <ModalProcessRequest data={data} />,
                size: "lg"
              });
            }}
          >
            Submit Credential
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
