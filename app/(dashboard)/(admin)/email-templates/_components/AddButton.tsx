"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import { Button } from "@nextui-org/react";
import { AddSquare } from "iconsax-react";
import dynamic from "next/dynamic";
const ModalCreate = dynamic(() => import("./ModalCreate"), {
  ssr: false,
});

export default function AddButton() {
  const { dispatchModal } = useDashboardContext();

  return (
    <Button
      color="primary"
      onClick={() =>
        dispatchModal({ type: "open", content: <ModalCreate />, size: "2xl" })
      }
      startContent={<AddSquare />}
    >
      Add New
    </Button>
  );
}
