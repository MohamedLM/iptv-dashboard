import { useDashboardContext } from "@/contexts/dashboard";
import { Tooltip } from "@nextui-org/react";
import { Edit, Trash } from "iconsax-react";
import { actionDeleteUser } from "../actions";
import dynamic from "next/dynamic";

const ConfirmDeleteModal = dynamic(() => import("@/components/ConfirmDeleteModal"), {
  ssr: false,
});

const ModalEditUser = dynamic(() => import("./ModalEditUser"), {
  ssr: false,
});

export default function CellActions({ data }: any) {
  const { dispatchModal } = useDashboardContext();

  return (
    <div className="flex justify-end gap-3">
      <Tooltip content="Edit user">
        <Edit
          onClick={() => dispatchModal({ type: "open", content: <ModalEditUser data={data} /> })}
          size={20}
          className="cursor-pointer active:opacity-50"
        />
      </Tooltip>
      <Tooltip color="danger" content="Delete user">
        <Trash
          onClick={() => {
            dispatchModal({
              type: "open",
              content: (
                <ConfirmDeleteModal
                  id={data.id}
                  action={actionDeleteUser}
                  pathToRevalidate="/users"
                />
              ),
            });
          }}
          size={20}
          className="text-danger cursor-pointer active:opacity-50"
        />
      </Tooltip>
    </div>
  );
}
