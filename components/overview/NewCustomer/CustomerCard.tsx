"use client";
import { Card, CardHeader, CardBody, User } from "@nextui-org/react";
import toNumber from "lodash/toNumber";
import { nFormat } from "@/utils/currency";

export default function CustomerCard(props: any) {
  return (
    <Card>
      <CardHeader className="justify-between">
        <User name={props.name} description={props.email || props.phone} />
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-4">
        <div className="flex items-end gap-1">
          <p className="font-bold text-xl">
            {nFormat(props.trial)}
          </p>
          <p className="text-default-400 text-md">Trial</p>
        </div>
        <div className="flex items-end gap-1">
          <p className="font-bold text-xl">{nFormat(props.paid)}</p>
          <p className="text-default-400 text-md">Subscription</p>
        </div>
        <div className="col-span-2 flex items-end gap-1">
          <p className="font-bold text-xl text-success">{nFormat(props.spent)}</p>
          <p className="text-default-400 text-md">Total spent</p>
        </div>
      </CardBody>
    </Card>
  );
}
