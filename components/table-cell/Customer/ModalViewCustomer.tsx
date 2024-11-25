"use client";

import Loading from "@/components/Loading";
import { SelectCustomer } from "@/database/schema";
import { formatDate } from "@/utils/date";
import {
  Button,
  Card,
  CardBody,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react";
import { map } from "lodash";
import { useEffect, useState } from "react";

interface Props {
  customer: SelectCustomer;
}

export default function ModalViewCustomer({ customer }: Props) {
  const [timeline, setTimeline] = useState<
    Array<{ type: string; id: string; created_at: string }>
  >([]);

  useEffect(() => {
    fetch(`/api/chart/customer?id=${customer.id}`)
      .then((res) => res.json())
      .then(setTimeline);
  }, [customer.id]);

  return (
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1">Customer Detail</ModalHeader>
      <ModalBody className="flex flex-col items-start gap-2">
        <User name={customer.name} description={customer.email} />
        <div className="w-full">
          {timeline.length ? (
            map(timeline, (t, i) => (
              <div key={i} className="relative pl-8 sm:pl-[220px] py-3 group">
                {/* <div className="font-medium mb-1 sm:mb-0">{t.type}</div> */}
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[190px] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-primary after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[190px] after:-translate-x-1/2 after:translate-y-1.5">
                  <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs p-2 h-6 mb-3 sm:mb-0 border border-primary rounded-full">
                    {formatDate(t.created_at)}
                  </time>
                  <div className="text-sm">{t.type}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="content-center m-4">
              <Loading />
            </div>
          )}
        </div>
      </ModalBody>
    </ModalContent>
  );
}
