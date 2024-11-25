"use client";
import Credentials from "@/components/table-cell/Credentials";
import Customer from "@/components/table-cell/Customer";
import Tags from "@/components/table-cell/Tags";
import { formatDate } from "@/utils/date";
import { Key } from "react";
import { ChartSuccess, Timer, Timer1, TimerStart } from "iconsax-react";
// import CellActions from "./CellActions";

export default function RenderCell(
  data: any,
  columnKey: Key,
  canEdit?: boolean
) {
  // @ts-ignore
  const cellValue = data[columnKey];
  switch (columnKey) {
    case "customer": {
      return <Customer customer={cellValue} data={data} />;
    }

    case "phone": {
      return data?.customer?.phone || data.country ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            {data?.customer?.phone}
          </span>
          <span className="text-tiny text-foreground-400 flex gap-1">
            {data.country}
          </span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }

    case "tags": {
      return (
        <Tags id={data.customer.id} tagsData={cellValue} canEdit={canEdit} />
      );
    }

    case "credentials": {
      return (
        <Credentials
          id={data.id}
          credentials={cellValue}
          confirmer={data.confirmer}
          canEdit={canEdit}
        />
      );
    }

    case "expiration": {
      return data.expiredAt || data.confirmedAt ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            <TimerStart size={18} />
            {formatDate(data.expiredAt)}
          </span>
          <span className="text-tiny text-foreground-400">{`started: ${formatDate(
            data.confirmedAt
          )}`}</span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }

    case "emailStatus": {
      return data.emailSentAt || data.autoRemind ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            <ChartSuccess className="text-success-400" size={18} />
            {formatDate(data.emailSentAt)}
          </span>
          <span className="text-tiny text-foreground-400 flex gap-1">
            <span>Email reminder:</span>
            <span className="text-success-400">active</span>
          </span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }

    case "product": {
      return data.productName || data.siteOrderId ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            {data.productName}
          </span>
          <span className="text-tiny text-foreground-400 flex gap-1">
            {data.siteOrderId}
          </span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }

    case "amount": {
      return data.amount ? (
        <div className="inline-flex flex-col items-start">
          <span className="text-small flex gap-1 text-inherit">
            {data.amount}
          </span>
          <span className="text-tiny text-foreground-400 flex gap-1">
            {data.currency}
          </span>
        </div>
      ) : (
        <div className="text-foreground-400 italic">not set</div>
      );
    }

    case "orderDate":
    case "updatedAt":
    case "createdAt": {
      return formatDate(cellValue);
    }

    default:
      return cellValue;
  }
}
