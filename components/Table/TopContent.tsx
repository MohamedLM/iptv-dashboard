import { Input } from "@nextui-org/react";
import { FilterSearch } from "iconsax-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

export interface Props {
  children?: ReactNode;
  searchPlaceholder?: string;
}

export default function TopContent({
  searchPlaceholder = "Search...",
  children,
}: Props) {
  const initialLoadedRef = useRef<boolean>(true);
  const [search, setSearch] = useQueryState("s", { shallow: false });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
    })
  );
  const [searchTerm, setSearchTerm] = useState<string>(search || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm || null);
      // only set the page if the query string exists in the initial load
      const initialPage = initialLoadedRef.current && page > 1 ? page : null;
      // if not initial load and there a search term, we reset the page to null
      setPage(!initialLoadedRef.current && searchTerm ? null : initialPage);
      initialLoadedRef.current = false;
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[400px]"
          placeholder={searchPlaceholder}
          startContent={<FilterSearch />}
          value={searchTerm}
          onClear={() => setSearch(null)}
          onValueChange={setSearchTerm}
        />
        <div className="flex gap-3 items-center">{children}</div>
      </div>
    </div>
  );
}
