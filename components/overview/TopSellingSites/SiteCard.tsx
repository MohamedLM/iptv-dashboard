"use client";

import { Card, CardHeader, CardBody, Avatar, Button } from "@nextui-org/react";
import toNumber from "lodash/toNumber";
import { useRouter } from "next/navigation";
import { Maximize } from "iconsax-react";
import { nFormat } from "@/utils/currency";

export default function SiteCard(props: any) {
  const { push } = useRouter();

  return (
    <Card>
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            name={props.name?.charAt(0)}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {props.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {props.id}
            </h5>
          </div>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onClick={() => push(`/manage/${props.id}`)}
          startContent={<Maximize size={18} />}
        >
          Dashboard
        </Button>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-4">
        <div className="flex gap-1">
          <p className="font-bold text-xl">
            {nFormat(props.trial)}
          </p>
          <p className="text-default-400 text-md">Trials</p>
        </div>
        <div className="flex items-end gap-1">
          <p className="font-bold text-xl">
            {nFormat(props.customer)}
          </p>
          <p className="text-default-400 text-md">Customers</p>
        </div>
        <div className="flex items-end gap-1">
          <p className="font-bold text-xl">
            {nFormat(props.paid)}
          </p>
          <p className="text-default-400 text-md">Orders</p>
        </div>
        <div className="flex items-end gap-1">
          <p className="font-bold text-xl text-success">
            {nFormat(props.revenue)}
          </p>
          <p className="text-default-400 text-md">Revenue</p>
        </div>
      </CardBody>
    </Card>
  );
}
