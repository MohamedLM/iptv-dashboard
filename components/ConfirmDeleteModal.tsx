"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { Button, ModalContent } from "@nextui-org/react";
import { Trash, Warning2 } from "iconsax-react";
import { useDashboardContext } from "@/contexts/dashboard";
import { useEffect } from "react";
import { toast } from "sonner";
import map from "lodash/map";

interface Props {
  action: any;
  [key: string]: any;
}

export default function ConfirmDeleteModal({
  action,
  ...props
}: Props) {
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending, result] = useServerAction(action);

  useEffect(() => {
    console.log('result', result)
    if (undefined === result) return;

    if (result.success) {
      dispatchModal({ type: "close" });
      toast.success(result.message || "Action completed!");
    } else {
      toast.error(result.message || "Action completed!");
    }
  }, [result, dispatchModal]);

  return (
    <ModalContent>
      {(onClose) => (
        <form
          className="text-center py-4 px-6 flex flex-col gap-4"
          action={async (formData) => {
            await runAction(formData);
          }}
        >
          <div className="m-auto [&_svg_path]:fill-danger-400">
            <Warning2 variant="Broken" size={46} />
          </div>

          {map(props, (value, key) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

          <div className="flex flex-col gap-1">
            <div className="text-xl">Are you sure?</div>
            <p className="text-sm text-default-500">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isPending}
              startContent={
                isPending ? undefined : <Trash variant="Bulk" size={24} />
              }
              color="danger"
              type="submit"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      )}
    </ModalContent>
  );
}
