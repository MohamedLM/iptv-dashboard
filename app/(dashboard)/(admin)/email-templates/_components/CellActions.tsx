import { useDashboardContext } from "@/contexts/dashboard";
import { Tooltip } from "@nextui-org/react";
import { Edit, Trash } from "iconsax-react";
import { actionDeleteTemplate } from "../actions";
import dynamic from "next/dynamic";

const ModalEdit = dynamic(() => import("./ModalEdit"), {
  ssr: false,
});

const ConfirmDeleteModal = dynamic(
  () => import("@/components/ConfirmDeleteModal"),
  {
    ssr: false,
  }
);

export default function CellActions({ data }: any) {
  const { dispatchModal } = useDashboardContext();

  return (
    <div className="flex justify-end gap-3">
      <Tooltip content="Edit template">
        <Edit
          onClick={() => {
            dispatchModal({
              type: "open",
              content: <ModalEdit data={data} />,
              size: "2xl",
            });
          }}
          size={20}
          className="cursor-pointer active:opacity-50"
        />
      </Tooltip>
      <Tooltip color="danger" content="Delete template">
        <Trash
          onClick={() => {
            dispatchModal({
              type: "open",
              content: (
                <ConfirmDeleteModal
                  id={data.id}
                  action={actionDeleteTemplate}
                  pathToRevalidate="/email-templates"
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
