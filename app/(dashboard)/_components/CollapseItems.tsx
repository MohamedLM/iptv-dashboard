"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface Props {
  icon: React.ReactNode;
  title: string;
  path: string;
  items: { path: string; title: string }[];
  siteId?: string;
}

export default function CollapseItems({
  icon,
  items,
  title,
  path,
  siteId,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const isActive =
    paths.includes(path || "") ||
    ("/" === pathname && "" === path) ||
    (`/manage/${siteId}` === pathname && "" === path);

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion defaultExpandedKeys={isActive ? [path] : []} className="px-0">
        <AccordionItem
          key={path}
          indicator={<ArrowDown2 />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger: clsx(
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",
              isActive
                ? "bg-primary-100 [&_svg_path]:fill-primary-500"
                : "hover:bg-default-100"
            ),

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12">
            {items.map((item, index) => {
              const itemHref = siteId
                ? `/manage/${siteId}/${path}/${item.path}`
                : `/${path}/${item.path}`;

              const isActive = paths.includes(item.path);
              return (
                <Link key={index} href={itemHref}>
                  <span
                    className={clsx(
                      "w-full flex py-1 hover:text-default-500 transition-colors",
                      isActive ? "text-primary-500" : "text-default-900"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
