"use client";
import Credentials from "@/components/table-cell/Credentials";
import Customer from "@/components/table-cell/Customer";
import Tags from "@/components/table-cell/Tags";
import { formatDate } from "@/utils/date";
import { Key } from "react";
import CellActions from "./CellActions";
import { ChartSuccess, Timer, Timer1, TimerStart } from "iconsax-react";
import { addDays, isAfter, subDays } from "date-fns";
import clsx from "clsx";
import { Tooltip } from "@nextui-org/react";
// import CellActions from "./CellActions";

// const DetailEmail = ({ data }: { data: any }) => {
//   return (
//     <div className="px-1 py-2">
//       <div className="text-small font-bold">Email Template</div>
//       <div className="text-tiny">{data.emailTemplate}</div>
//     </div>
//   );
// };

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
      const currentDate = new Date();
      const isExpired = isAfter(currentDate, data.expiredAt);

      return data.expiredAt || data.confirmedAt ? (
        <div
          className={clsx({
            "inline-flex flex-col items-start": true,
            "text-red-500": isExpired,
            "text-yellow-500":
              !isExpired && isAfter(addDays(currentDate, 10), data.expiredAt),
          })}
        >
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
        <Tooltip content={`Email template: ${data.emailTemplate}`}>
          <div className="inline-flex flex-col items-start">
            <span className="text-small flex gap-1 text-inherit">
              <ChartSuccess className="text-success-400" size={18} />
              {formatDate(data.emailSentAt)}
            </span>
            <span className="text-tiny text-foreground-400 flex gap-1">
              <span>Email reminder:</span>
              {data.autoRemind ? (
                <span className="text-success-400">active</span>
              ) : (
                <span className="text-danger-400">inactive</span>
              )}
            </span>
          </div>
        </Tooltip>
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

    case "actions": {
      return canEdit && <CellActions data={data} />;
    }

    default:
      return cellValue;
  }
}
