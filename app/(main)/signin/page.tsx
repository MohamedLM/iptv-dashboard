"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { Button, Divider, Image, Input } from "@nextui-org/react";
import { actionSignin } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Signin() {
  const { push } = useRouter();
  const [runAction, isPending] = useServerAction(actionSignin, (result) => {
    console.log("result", result);
    if (result?.success) {
      toast.success(result?.message);
      push("/");
    } else {
      toast.error(result?.message);
    }
  });
  return (
    <div className="flex h-screen">
      <form
        action={async (formData) => {
          await runAction(formData);
        }}
        className="flex-1 flex-col flex items-center justify-center p-6"
      >
        <div className="md:hidden absolute left-0 right-0 bottom-0 top-0 z-0">
          <Image
            className="w-full h-full"
            src="https://nextui.org/gradients/docs-right.png"
            alt="gradient"
          />
        </div>
        <div className="text-center text-[25px] font-bold mb-6">Login</div>

        <div className="flex flex-col w-full md:w-2/3 max-w-sm gap-4 mb-4">
          <Input
            variant="bordered"
            name="username"
            label="Username"
            type="text"
          />
          <Input
            variant="bordered"
            name="password"
            label="Password"
            type="password"
          />
        </div>

        <Button type="submit" variant="flat" color="primary">
          {isPending ? `Signing in...` : `Signin`}
        </Button>
      </form>

      <div className="hidden my-10 md:block">
        <Divider orientation="vertical" />
      </div>

      <div className="hidden md:flex flex-1 relative items-center justify-center p-6">
        <div className="absolute left-0 right-0 bottom-0 top-0 z-0">
          <Image
            className="w-full h-full"
            src="https://nextui.org/gradients/docs-right.png"
            alt="gradient"
          />
        </div>

        <div className="z-10">
          <h1 className="font-bold text-[45px]">IPTV Dashboard</h1>
          <div className="font-light text-slate-400 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            possimus voluptate, sapiente assumenda deserunt repellendus,
            perferendis odit voluptas hic dolores laborum fugit ut? Architecto
            quo ex quidem vitae quae rem.
          </div>
        </div>
      </div>
    </div>
  );
}
