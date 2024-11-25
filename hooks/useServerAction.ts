import { useState, useEffect, useTransition, useRef } from "react";
import { toast } from "sonner";

type ToastCallback = {
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
};

export const useServerAction = <P extends any[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(...args: P) => Promise<R | undefined>, boolean, any] => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R>();
  const [finished, setFinished] = useState(false);
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>();

  useEffect(() => {
    if (!finished) return;

    if (onFinished) onFinished(result);
    resolver.current?.(result);
  }, [result, finished]);

  const runAction = async (...args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(...args).then((data) => {
        setResult(data);
        setFinished(true);
      });
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  return [runAction, isPending, result];
};

export const showToastResult = (callback?: ToastCallback) => (result: any) => {
  console.log("sdasd", { result, callback });
  if (result?.success) {
    toast.success(result?.message || "Completed");
    callback?.onSuccess && callback.onSuccess(result);
  } else {
    toast.error(result?.message || "Failed!");
    callback?.onError && callback.onError(result);
  }
};
