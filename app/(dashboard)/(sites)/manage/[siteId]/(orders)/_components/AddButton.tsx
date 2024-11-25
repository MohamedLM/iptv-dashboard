"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import { Button } from "@nextui-org/react";
import { AddSquare } from "iconsax-react";

// const ModalCreateUser = dynamic(() => import("./ModalCreateUser"), {
//   ssr: false,
// });

export default function AddButton() {
  const { dispatchModal } = useDashboardContext();

  return (
    <Button
      color="primary"
      onClick={() => dispatchModal({ type: "open", content: <div>dasd</div> })}
      startContent={<AddSquare />}
    >
      Add New
    </Button>
  );
}
