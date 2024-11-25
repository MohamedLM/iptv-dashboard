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
import dynamic from "next/dynamic";
import { actionDeleteSiteUser } from "../actions";
import { useEditSiteContext } from "../../provider";

const ConfirmDeleteModal = dynamic(
  () => import("@/components/ConfirmDeleteModal"),
  {
    ssr: false,
  },
);

interface Props {
  data: any;
}

export default function CellActions({ data }: Props) {
  const { id } = useEditSiteContext();
  const { dispatchModal } = useDashboardContext();

  return (
    <div className="relative flex justify-end items-center gap-2">
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
                content: (
                  <ConfirmDeleteModal
                    action={actionDeleteSiteUser}
                    userId={data.id}
                    siteId={id}
                    pathToRevalidate={`/sites/${id}/access`}
                  />
                ),
              });
            }}
            className="text-danger"
            color="danger"
          >
            Delete Access
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
