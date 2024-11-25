"use client"

import { ArrowRight2, Home, SecurityUser } from "iconsax-react";
import capitalize from "lodash/capitalize";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadcrumbLink = ({
  isActive,
  url,
  label,
}: {
  isActive: boolean;
  url: string;
  label: string;
}) => {
  return !isActive ? (
    <div className="flex items-center gap-1">
      <Link href={url}>
        <span>{capitalize(label)}</span>
      </Link>
      <span><ArrowRight2 size={16} /></span>
    </div>
  ) : (
    <span className="text-primary-500">{capitalize(label)}</span>
  );
};

export default function Breadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  // return <pre>{JSON.stringify(pathNames, null, 2)}</pre>;
  return (
    <ul className="flex max-md:hidden gap-1">
      <li className="flex gap-2">
        <Home />
        <BreadcrumbLink label="home" url="/" isActive={pathNames.length < 1} />
      </li>

      {pathNames.map((path, idx) => {
        const url = `/${pathNames.slice(0, idx + 1).join("/")}`;
        const isActive = pathNames[pathNames.length - 1] === path;
        return (
          <li key={idx} className="flex gap-2">
            <BreadcrumbLink label={path} url={url} isActive={isActive} />
          </li>
        );
      })}
    </ul>
  );
}
