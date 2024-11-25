import { useDashboardContext } from "@/contexts/dashboard";
import { Tooltip } from "@nextui-org/react";
import { Edit, Eye, Maximize, Trash } from "iconsax-react";
import { actionDeleteSite } from "../actions";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ConfirmDeleteModal = dynamic(() => import("@/components/ConfirmDeleteModal"), {
  ssr: false,
});

export default function CellActions({ data }: any) {
  const { dispatchModal } = useDashboardContext();
  const { push } = useRouter();

  return (
    <div className="flex justify-end gap-3">
      <Tooltip content="View dashboard">
        <Maximize
          onClick={() => push(`/manage/${data.id}`)}
          size={20}
          className="cursor-pointer active:opacity-50"
        />
      </Tooltip>
      <Tooltip content="Edit site">
        <Edit
          onClick={() => push(`/sites/${data.id}`)}
          size={20}
          className="cursor-pointer active:opacity-50"
        />
      </Tooltip>
      <Tooltip color="danger" content="Delete site">
        <Trash
          onClick={() => {
            dispatchModal({
              type: "open",
              content: (
                <ConfirmDeleteModal
                  id={data.id}
                  action={actionDeleteSite}
                  pathToRevalidate="/sites"
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
