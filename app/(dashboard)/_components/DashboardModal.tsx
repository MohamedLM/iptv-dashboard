"use client";
import { Modal, useDisclosure } from "@nextui-org/react";
import { useDashboardContext } from "@/contexts/dashboard";

export default function DashboardModal() {
  const { modal, dispatchModal } = useDashboardContext();
  const { isOpen, onOpenChange } = useDisclosure({
    isOpen: modal.open,
    onClose: () => {
      dispatchModal({ type: "close" });
    },
  });

  return (
    <Modal size={modal.size} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      {modal.content}
    </Modal>
  );
}
